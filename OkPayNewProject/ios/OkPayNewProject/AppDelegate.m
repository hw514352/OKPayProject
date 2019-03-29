/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "HWNetworkTool.h"
#import "SSZipArchive.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"OkPayNewProject"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  //  [self checkAPPUpdateState];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getJSCodeLocation];
}

- (NSURL *)getJSCodeLocation {
  NSURL *jsCodeLocation;
  
  NSString *localPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
  NSString *filePath = [localPath stringByAppendingPathComponent:@"bundle-ios/main.jsbundle"];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  //本地是否存在
  if([fileManager fileExistsAtPath:filePath]) {
    NSString *newUrl = [NSString stringWithFormat:@"file://%@",filePath];
    jsCodeLocation = [NSURL URLWithString:newUrl];
    return jsCodeLocation;
  } else {
#if DEBUG
    // 原来的jsCodeLocation
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
    return jsCodeLocation;
  }
}

//检查更新状态
- (void)checkAPPUpdateState {
  [[HWNetworkTool shareNetworkTool] getDataWithUrl:@"/btb2-client/api/pro/getLatestVersion?type=2" parameters:nil success:^(id json) {
    NSUserDefaults *aUserDefaults = [NSUserDefaults standardUserDefaults];
    NSDictionary *info = [[json objectForKey:@"dataMap"] objectForKey:@"data"];
    if([info count]) {
      NSString *localIpaVer = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//APP版本号//本地ipa版本号
      NSString *requestHotVer = [info objectForKey:@"bundleVersion"] ?: @"";//服务器热更新版本号
      NSString *localHotVer = [aUserDefaults objectForKey:@"localBundleVersion"] ?: @"0.0.1";//本地热更新版本号
      
      NSString *requestIpaVer = [info objectForKey:@"appVersionCode"]?:@"";//服务器ipa版本号
      //检查是否有APP更新
      [self judgeIpaLocalV:localIpaVer requresVer:requestIpaVer isCertain:[info objectForKey:@"appMinCode"] urlIpa:[info objectForKey:@"appDownloadUrl"] updataComtent:[info objectForKey:@"appUpdateContent"] ];
      //检查是否有热更新
      if ([self judgeBig:localHotVer oldVersion:requestHotVer]){
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"jsbundle有更新" message:nil preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *downloadSelect = [UIAlertAction actionWithTitle:@"下载" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
          //下载新版本jsbundle
          NSString *dunderUrl = [info objectForKey:@"bundleDownloadUrl"]?:@"";
          [self downloadFile:dunderUrl InfoVersion:(NSDictionary *)info];
        }];
        [alert addAction:downloadSelect];
        UIViewController *rootView = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootView presentViewController:alert animated:YES completion:nil];
      }
      
    }
  } failure:^(NSError *error) {
    
  }];
}

//下载热更新文件
-(void)downloadFile:(NSString *)dunderUrl InfoVersion:(NSDictionary *)InfoVersion{
  [[HWNetworkTool shareNetworkTool] downLoadDataWithUrl:dunderUrl success:^(id json) {
    //下载完成解压
    NSError *error;
    NSString *desPath = [[NSString stringWithFormat:@"%@",NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0]] stringByAppendingPathComponent:@"bundle-ios"];
    [SSZipArchive unzipFileAtPath:json toDestination:desPath overwrite:YES password:nil error:&error];
    if(!error){
      NSLog(@"解压成功");
      NSUserDefaults * aUserDefaults = [NSUserDefaults standardUserDefaults];
      [aUserDefaults setObject:[InfoVersion objectForKey:@"bundleVersion"] forKey:@"localBundleVersion"];
      NSString *strVer = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
      [aUserDefaults setObject:strVer forKey:@"isLoadHot"];
      [aUserDefaults synchronize];
      //      [_bridge reload];
    }else{
      NSLog(@"解压失败");
    }
  } failure:^(NSError *error) {
    NSLog(@"下载失败:%@",error.localizedDescription);
  }];
}

//检查是否需要重新下载APP
- (void)judgeIpaLocalV:(NSString *)localIpaVer requresVer:(NSString *)requestIpa isCertain:(NSString *)iscer urlIpa:(NSString *)urlIpa updataComtent:(NSString *)content{
  if([self judgeBig:localIpaVer oldVersion:requestIpa]){
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"有新的版本更新" message:content preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *downloadSelect = [UIAlertAction actionWithTitle:@"去下载" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
      //下载新版本APP
      NSURL *url = [NSURL URLWithString:urlIpa];
      if ([[UIApplication sharedApplication] canOpenURL:url]) {
        [[UIApplication sharedApplication] openURL:url];
      }
    }];
    if([iscer isEqualToString:@"0"]){
      UIAlertAction *cancelSelect = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {}];
      [alert addAction:cancelSelect];
    }
    
    [alert addAction:downloadSelect];
    
    UIViewController *rootView = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    [rootView presentViewController:alert animated:YES completion:nil];
  }
}

#pragma mark - 判断大小
- (BOOL)judgeBig:(NSString *)newVersion  oldVersion:(NSString *)oldValue{
  oldValue = ![oldValue isEqual:[NSNull null]]?oldValue:@"";
  newVersion = ![newVersion isEqual:[NSNull null]]?newVersion:@"";
  NSInteger a = [newVersion compare:oldValue];
  if (a == NSOrderedAscending ){
    return YES;
  }  if (a == NSOrderedSame){
    return NO;
  }else {
    return NO;
  }
}
@end
