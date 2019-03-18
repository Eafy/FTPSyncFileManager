# FTPSyncFileManager
## 导入RN组件模块
```
import {
    NativeModules,
    NativeEventEmitter
} from 'react-native';
const { FTPSyncFileManager } = NativeModules;
```


## 添加回调监听接口
```
export default class FTPSyscFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        ......
        ftpSyncMrgListener: new NativeEventEmitter(FTPSyncFileManager),
        ......
        };
    }

    componentWillMount() {
        this.state.ftpSyncMrgListener.addListener(FTPSyncFileManager.kRNFTPSyncFileManager, (reminder) => {
             this.onHandleFTPCallbackData(reminder);  //reminder为组件回调的数据
             let obj = JSON.parse(manager);
        });
    }
    
    onHandleFTPCallbackData(cbData) {
      let cbObj = JSON.parse(cbData);
      let methodName = cbObj.method;
      let dataStr = cbObj.data;
      let dataObj = JSON.parse(stringObj(dataStr));
      ......
    }
    
    ......
} 
```

## 模块接口
| Method                    | define              | result
| ------------------------- | -------------------------     | -------------------------
| Promise currentWiFi((ssid) => {}) | 获取当前手机连接的WiFi名称 | 成功则为WiFi名称，否则null
| Promise openDeviceWIFI(String url, String imei, String appKey, String secret, String token) | 发送设备启动WiFi热点命令 | 情况1：{\"method\":\"onOpenDeviceWIFI\",\"data\":{\"success\":true,\"msg\":\"设备WIFI打开成功,请连接wifi\"}}<br/>情况2：{\"method\":\"onOpenDeviceWIFI\",\"data\":{\"success\":true,\"msg\":\"设备WIFI打开成功,wifi已连接\"}}</br>失败：{\"method\":\"onOpenDeviceWIFI\",\"data\":{\"success\":true,\"msg\":\"设备WIFI打开失败\",\"errMsg":\"错误信息\"}}</br>
| Promise connectFTP() | 启动并连接设备端FTP服务 | 成功：{\"method\":\"onConnectFTP\",\"data\":{\"success\":true,\"msg\":\"已经成功连接设备!\"}}<br/>失败：{\"method\":\"onConnectFTP\",\"data\":{\"success\":true,\"msg\":\"与设备连接异常!\"}}</br>
| Promise closeFTP() | 关闭与设备端的FTP连接服务 | 无回调
| Promise findAllFile(bool isVideo) | 查找设备端视图或图片列表(返回接口为2级列表)，若查找图片会自动下载图片，视频则不会 |{\"method\": \"onFindAllFile\", 	\"data\": [ 		[{ 			\"time\": \"2019-03-04\", //日期 			\"localUrl\": \"\\/var\\/mobile\\/Containers\\/Data\\/Application\\/670F1CEA-D67A-4B8A-95F7-CC4522A37DC1\\/Library\\/Caches\\/JM_Cache\\/123\\/Thumb\\/351609080199717\\/2019_03_04_09_37_40.jpg\", //文件存在当前手机的地址 			\"totalSize\": 637852, //文件大小 			\"isDownload\": false, //是否已下载 			\"progress\": 0, //下载进度0~1.0 			\"fileType\": false, //文件类型，图片:false，视频：true 			\"name\": \"2019_03_04_09_37_40.jpg\" //文件的名称，后面的下载、暂停、删除则使用此关键词 		}] 	] } <br/>PS:2维数组中地一维数组表示一天中的数据，第二维表示当前的所有数据；</br>
| Promise downloadFile(Array fileName) | 下载文件，图片资源默认查找时已下载 | {\"method\":\"onDownloadFile\",\"data\":{\"name\":\"2019_03_18_10_25_34.3gp\",\"progress\":0.13543144808932833}}<br/>PS：下载成功之后的进度progress为1或1.0</br>
| Promise pauseFile(String fileName) | 暂停正在下载的文件，参数只支持单一的文件名称(非数组) | 无回调
| Promise deleteFile(Array fileName) | 删除文件，同时删除设备端和本地的已下载或已缓存的文件 | <br/>成功：{\"method\":\"onDeleteFile\",\"data\":{\"success\":true}}</br>失败：{\"method\":\"onDeleteFile\",\"data\":{\"success\":false}}</br>
