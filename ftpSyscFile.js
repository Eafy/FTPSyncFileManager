import React, {
    Component
} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Alert,
    Button,
    TouchableHighlight,
    TextInput,
    ScrollView,
    NativeModules,
    NativeEventEmitter
} from 'react-native';

import { styles, stringObj } from './comm';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

const { FTPSyncFileManager } = NativeModules;

export default class FTPSyscFile extends Component {
    static navigationOptions = {
        title: 'FTP媒体同步'
    }

    constructor(props) {
        super(props);
        this.state = {
        imei:'351609080199717',
        fileType: false,
        connected: false,
        filesList: null,
        reslut: '',
        ftpSyncMrgListener: new NativeEventEmitter(FTPSyncFileManager),
        };
    }

    componentWillMount() {
        this.state.ftpSyncMrgListener.addListener(FTPSyncFileManager.kRNFTPSyncFileManager, (reminder) => {
             this.onHandleFuncAPI(reminder);
        });
    }

    componentWillUnmount() {

    }

    onHandleFuncAPI(manager) {
        let obj = JSON.parse(manager);

        if (obj.method === 'onOpenDeviceWIFI') {
            this.setState({
                          reslut: stringObj(obj.data)
                          });
            Alert.alert(stringObj(obj.data));
        } else if (obj.method === 'onConnectFTP') {
            let dataStr = stringObj(obj.data);
            let dataObj = JSON.parse(dataStr);
            this.setState({
                          connected: dataObj.success,
                          reslut: dataStr
            });
        } else if (obj.method === 'onFindAllFile') {
            let dataStr = stringObj(obj.data);
            let dataObj = JSON.parse(dataStr);
            this.setState({
                          filesList: dataObj
                          });
        } else if (obj.method === 'onDownloadFile') {
            this.setState({
                          reslut: stringObj(obj.data)
                          });
        } else if (obj.method === 'onDeleteFile') {
            this.setState({
                          reslut: stringObj(obj)
                          });
        }
    }

    onSelectFileType(index, value){
        this.setState({
                      fileType: value
                      });
    }

    onSendOpenDeiveWiFi() {
        FTPSyncFileManager.currentWiFi((ssid) => {
             console.info("SSID:", ssid, this.state.imei);
             if (ssid === this.state.imei) {
                  Alert.alert('你已连接设备WiFi热点！');
             } else {
                  FTPSyncFileManager.openDeviceWIFI("http://smarthome.jimicloud.com/route/app", "351609080199717", "449A7D0E9C1911E7BEDB00219B9A2EF3","695c1a459c1911e7bedb00219b9a2ef3","2FCB70C6A1EE00CF688F5E9C54C3D502")
             }
        });
    }

    onConnectFTP() {
        if (!this.state.connected) {
            FTPSyncFileManager.currentWiFi((ssid) => {
//                if (ssid === this.state.imei) {   //项目需要打开，iOS测试的时候没有加证书，所以获取不到WIFI信息才屏蔽
                    FTPSyncFileManager.connectFTP(this.state.imei)
//                }
           });
        } else {
            Alert.alert('你未连接设备WIFI！');
        }
    }

    onCloseFTP() {
        FTPSyncFileManager.closeFTP()
    }

    onFindAllFiles() {
        FTPSyncFileManager.currentWiFi((ssid) => {
//           if (ssid === this.state.imei) {   //项目需要打开，iOS测试的时候没有加证书，所以获取不到WIFI信息才屏蔽
               FTPSyncFileManager.findAllFile(this.state.fileType)
//           } else {
//               Alert.alert('你未连接设备WIFI！');
//           }
        });
    }

    onDownloadFile() {
        if (this.state.connected) {
            let firstList = this.state.filesList[0]
            let medieInfo = firstList[0]
            FTPSyncFileManager.downloadFile([medieInfo.name])
        } else {
            Alert.alert('你未连接设备WIFI！');
        }
    }

    onPauseFile() {
        let firstList = this.state.filesList[0]
        let medieInfo = firstList[0]
        FTPSyncFileManager.pauseFile(medieInfo.name)
    }

    onDeleteFile() {
        if (this.state.connected) {
            let firstList = this.state.filesList[0]
            let medieInfo = firstList[0]
            FTPSyncFileManager.deleteFile([medieInfo.name])
        } else {
            Alert.alert('你未连接设备WIFI！');
        }
    }

    render() {
        return (
                <ScrollView style={styles.container}>
                <Text>输出结果:</Text>
                <Text style={styles.reslut}>{this.state.reslut}</Text>

                <View style={styles.inputContent}>
                    <View style={ftpSyscFileStyles.inputText}>
                        <Text>文件类型:</Text>
                    </View>
                    <View style={ftpSyscFileStyles.inputBox } >
                        <RadioGroup selectedIndex={0}
                            onSelect={(index, value) => this.onSelectFileType(index, value)} >
                        <RadioButton value={false} >
                            <Text>图片</Text>
                        </RadioButton>
                        <RadioButton value={true}>
                            <Text>视频</Text>
                        </RadioButton>
                        </RadioGroup>
                    </View>
                </View>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onSendOpenDeiveWiFi()} style={styles.btnContainer} >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>发送设备启动热点命令</Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onConnectFTP()} style={styles.btnContainer} >
                <View style={styles.button}>
                <Text style={styles.buttonText}>启动FTP连接服务</Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onCloseFTP()} style={styles.btnContainer} >
                <View style={styles.button}>
                <Text style={styles.buttonText}>关闭FTP连接服务</Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onFindAllFiles()} style={styles.btnContainer} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>获取文件列表</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onDownloadFile()} style={styles.btnContainer} >
                <View style={styles.button}>
                <Text style={styles.buttonText}>开始下载</Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onPauseFile()} style={styles.btnContainer} >
                <View style={styles.button}>
                <Text style={styles.buttonText}>暂停下载</Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight  underlayColor="white" onPress={() =>  this.onDeleteFile()} style={styles.btnContainer} >
                <View style={styles.button}>
                <Text style={styles.buttonText}>删除文件</Text>
                </View>
                </TouchableHighlight>

                </ScrollView>
                );
    }
}

const ftpSyscFileStyles = StyleSheet.create({
            inputBox:{
                flex: 2,
                height: 80,
                backgroundColor: '#FFF'
            },
            inputText:{
                width: 80,
                height: 80,
                alignItems:'center',
                justifyContent: 'center',
                backgroundColor: '#FFF'
            },
});
