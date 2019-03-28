//
//  HWNetworkTool.h
//  UWEI
//
//  Created by lenew on 2017/10/16.
//  Copyright © 2017年 UWEI. All rights reserved.
//

#import "AFNetworking.h"
/**
 *  请求成功回调json数据
 *
 *  @param proportion 进度比例
 */
typedef void(^Progress)(CGFloat proportion);
/**
 *  请求成功回调json数据
 *
 *  @param json json串
 */
typedef void(^Success)(id json);
/**
 *  请求失败回调错误信息
 *
 *  @param error error错误信息
 */
typedef void(^Failure)(NSError *error);



@interface HWNetworkTool : AFHTTPSessionManager

+ (instancetype)shareNetworkTool;
- (void)setHeaderWithToken:(NSString *)token;

/**
 *  GET请求
 *
 *  @param url       NSString 请求url
 *  @param paramters NSDictionary 参数
 *  @param success   void(^Success)(id json)回调
 *  @param failure   void(^Failure)(NSError *error)回调
 */
- (void)getDataWithUrl:(NSString *)url parameters:(NSDictionary *)paramters success:(Success)success failure:(Failure)failure;

/**
 *  POST请求
 *
 *  @param url       NSString 请求url
 *  @param paramters NSDictionary 参数
 *  @param success   void(^Success)(id json)回调
 *  @param failure   void(^Failure)(NSError *error)回调
 */
- (void)postDataWithUrl:(NSString *)url parameters:(NSDictionary *)paramters success:(Success)success failure:(Failure)failure;


//下载请求
- (void)downLoadDataWithUrl:(NSString *)url success:(Success)success failure:(Failure)failure;
/**
 *  POST请求 上传文件
 *
 *  @param url       NSString 请求url
 *  @param paramters NSDictionary 参数
 *  @param datas     UIImage 图片
 *  @param progress  void(^Progress)(CGFloat proportion)回调
 *  @param success   void(^Success)(id json)回调
 *  @param failure   void(^Failure)(NSError *error)回调
 */
- (void)upLoadDataWithUrl:(NSString *)url parameters:(NSDictionary *)paramters datas:(NSData *)datas progress:(Progress)progress success:(Success)success failure:(Failure)failure;


//开启AFN的网络监听
+ (void)networkingMonitoring;
@end
