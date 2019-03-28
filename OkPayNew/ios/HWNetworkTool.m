//
//  HWNetworkTool.m
//  UWEI
//
//  Created by lenew on 2017/10/16.
//  Copyright © 2017年 UWEI. All rights reserved.
//

#import "HWNetworkTool.h"
#import "AFNetworkActivityIndicatorManager.h"
#import "HWAlertController.h"
#define ServerBaseURL     @"http://dev.ylywcn.com"
#define OKPayUserToken           @"OKPayUserToken"

static UIAlertView *reachabilityAlertView;//网络变化警告视图

@implementation HWNetworkTool

static HWNetworkTool *networkTool = nil;
+ (instancetype)shareNetworkTool{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        networkTool = [[self alloc] initWithBaseURL:[NSURL URLWithString:ServerBaseURL]];
        networkTool.requestSerializer.timeoutInterval = 15;
//        networkTool.requestSerializer = [AFJSONRequestSerializer serializer];
//        networkTool.responseSerializer = [AFHTTPResponseSerializer serializer];
        
        networkTool.responseSerializer.acceptableContentTypes = [networkTool.responseSerializer.acceptableContentTypes setByAddingObject:@"text/html"];
    });
    NSString *token = [[NSUserDefaults standardUserDefaults] objectForKey:OKPayUserToken];
    if (token) {
      [networkTool setHeaderWithToken:token];
    }
  
    return networkTool;
}
- (void)setHeaderWithToken:(NSString *)token {
  //header 固定token
  [self.requestSerializer setValue:token forHTTPHeaderField:@"token"];
}
#pragma mark - （无RSA加密接口）
//GET请求
- (void)getDataWithUrl:(NSString *)url parameters:(NSDictionary *)paramters success:(Success)success failure:(Failure)failure {
    networkTool.responseSerializer = [AFJSONResponseSerializer serializer];
    [networkTool GET:url parameters:paramters headers:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        //登录失效，退出到登录界面
        int state = [responseObject[@"state"] intValue];
        if (state == 301 || state == 302) { //301挤下线 302 token失效
            NSString *message = state == 301 ? @"账号在其他设备登录" : @"登录失效或过期";
            [HWAlertController alertWithTitle:message message:@"请重新登录！" textFieldNumber:0 actionTitles:@[@"确定"] textFieldHandler:nil actionHandler:^(UIAlertAction *action, NSUInteger index) {
              [[NSNotificationCenter defaultCenter] postNotificationName:@"LoginFailure" object:nil];
            }];
            return;
        }
        
        if (responseObject) {
            if (success) success(responseObject);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (error) {
            if (failure) failure(error);
        }
    }];
}
//POST请求
- (void)postDataWithUrl:(NSString *)url parameters:(NSDictionary *)paramters success:(Success)success failure:(Failure)failure {
    networkTool.responseSerializer = [AFJSONResponseSerializer serializer];
    [networkTool POST:url parameters:paramters headers:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        //登录失效，退出到登录界面
        int state = [responseObject[@"state"] intValue];
        if (state == 301 || state == 302) { //301挤下线 302 token失效
            NSString *message = state == 301 ? @"账号在其他设备登录" : @"登录失效或过期";
            [HWAlertController alertWithTitle:message message:@"请重新登录！" textFieldNumber:0 actionTitles:@[@"确定"] textFieldHandler:nil actionHandler:^(UIAlertAction *action, NSUInteger index) {
              [[NSNotificationCenter defaultCenter] postNotificationName:@"LoginFailure" object:nil];
            }];
            return;
        }
        
        if (responseObject) {
            if (success) success(responseObject);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (error) {
            if (failure) failure(error);
        }
    }];
}
//下载请求
- (void)downLoadDataWithUrl:(NSString *)url success:(Success)success failure:(Failure)failure {
  networkTool.responseSerializer = [AFJSONResponseSerializer serializer];
  //下载地址
  
  NSURL *mgrurl = [NSURL URLWithString:url];
  NSURLRequest *request = [NSURLRequest requestWithURL:mgrurl];
  NSURLSessionDownloadTask *download = [networkTool downloadTaskWithRequest:request progress:^(NSProgress * _Nonnull downloadProgress) {
    //在主线程中调用
    NSLog(@"进度%f",1.0*downloadProgress.completedUnitCount / downloadProgress.totalUnitCount);
//    CGFloat jsw = 1.0* downloadProgress.completedUnitCount / downloadProgress.totalUnitCount* (PW-40);
//    self.jdView.frame=CGRectMake(0,0, jsw,5);
//    self.jdText.text= [NSStringstringWithFormat:@"更新进度(%.0f/100)",100.0*downloadProgress.completedUnitCount/ downloadProgress.totalUnitCount];
//    self.suduText.text= [NSStringstringWithFormat:@"%lldkb/s",[MLRNSingtongetInterfaceBytes]/1024/1024];
  } destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
    NSString *fullPath = [[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject] stringByAppendingPathComponent:response.suggestedFilename];
    NSLog(@"targetPath:%@",targetPath);
    NSLog(@"fullPath:%@",fullPath);
    return[NSURL fileURLWithPath:fullPath];
  } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
    if (!error) {
      if (success) success([filePath path]);
    } else {
      if (failure) failure(error);
    }
  }];
  
  [download resume];
}

//上传图片文件
- (void)upLoadDataWithUrl:(NSString *)url parameters:(NSDictionary *)paramters datas:(NSData *)datas progress:(Progress)progress success:(Success)success failure:(Failure)failure {
    networkTool.responseSerializer = [AFHTTPResponseSerializer serializer];
    //formData: 专门用于拼接需要上传的数据,在此位置生成一个要上传的数据体
    [networkTool POST:url parameters:paramters headers:nil constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        
        //在网络开发中，上传文件时，是文件不允许被覆盖，文件重名
        //要解决此问题，
        //可以在上传时使用当前的系统事件作为文件名
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        //设置时间格式
        formatter.dateFormat = @"yyyyMMddHHmmss";
        NSString *str = [formatter stringFromDate:[NSDate date]];
        NSString *fileName = [NSString stringWithFormat:@"%@.png", str];
        
        /*
         此方法参数
         1. 要上传的[二进制数据]
         2. 对应网站上[upload.php中]处理文件的[字段"file"]
         3. 要保存在服务器上的[文件名]
         4. 上传文件的[mimeType]
         */
        //        NSData *data = UIImagePNGRepresentation(datas);
        [formData appendPartWithFileData:datas name:@"file" fileName:fileName mimeType:@"image/png"];
        
    } progress:^(NSProgress * _Nonnull uploadProgress) {
        
        //上传进度
        // @property int64_t totalUnitCount;     需要下载文件的总大小
        // @property int64_t completedUnitCount; 当前已经下载的大小
        // 回到主队列刷新UI
        dispatch_async(dispatch_get_main_queue(), ^{
            CGFloat proportion = 1.0 * uploadProgress.completedUnitCount / uploadProgress.totalUnitCount;
            if (progress) {
                progress(proportion);
            }
        });
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        //解析数据
        NSString *jsonString = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
        NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        NSError *err;
        id obj = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&err];
        if (obj) {
            if (success) success(obj);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (error) {
            if (failure) failure(error);
        }
    }];
}


//开启AFN的网络监听 并做提示
+ (void)networkingMonitoring{
    //开启网络请求标识图
    [[AFNetworkActivityIndicatorManager sharedManager] setEnabled:YES];
    
    AFNetworkReachabilityManager *mgr = [AFNetworkReachabilityManager sharedManager];
    [mgr setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        switch (status) {
            case AFNetworkReachabilityStatusNotReachable:{
                if (reachabilityAlertView == nil) {
                    reachabilityAlertView = [[UIAlertView alloc] initWithTitle:@"网络连接已断开" message:@"请检查网络设置" delegate:nil cancelButtonTitle:nil otherButtonTitles:@"确定", nil];
                }
                [reachabilityAlertView show];
            }
                break;
            default:
                if ([reachabilityAlertView isVisible]) {
                    [reachabilityAlertView dismissWithClickedButtonIndex:0 animated:NO];
                }
                break;
        }
    }];
    [mgr startMonitoring];
}
@end
