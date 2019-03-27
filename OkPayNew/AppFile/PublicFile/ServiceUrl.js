var is_Test_App = false;

// 需要用服务器调试接口打开以下注释
var HostUrl = is_Test_App ? 'http://dev.ylywcn.com' : 'http://app.okpaycity.com';
var base_project_name = '/btb2-client/'
var shopMall_project_name = '/btb2mall-client/'
var other_project_name = '/zjjoy-client/';

export default {
    is_Test_App: is_Test_App,
    RootUrl: HostUrl,
    login: base_project_name + 'api/zjjoy/login',//登录
    register: base_project_name + 'api/zjjoy/register',//注册
}