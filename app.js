var ut = require('./common.js');
var async = require('async');
var fs = require('fs');
console.log('开始测试!!!')

//任务数组
var task = [];
//自动获取搜索页面的公众号.
task.push(function (callback) {
  ut.search_key_word(callback)
});
//根据public_num搜索公众号,最好是微信号或者微信全名.
task.push(function (public_nums, callback) {
  ut.search_wechat(public_nums, callback)
});
//根据url获取公众号获取最后10条图文列表
task.push(function (urls, callback) {
  ut.look_wechat_by_url(urls, callback)
})
//根据图文url获取详细信息,发布日期,作者,公众号,阅读量,点赞量等
task.push(function (wechat_account, callback) {
  ut.get_info_by_url(wechat_account, callback)
})
//执行任务
async.waterfall(task, function (err, result) {
    if (err) return console.log(err);
    console.log('result:\n', result);
    async.forEachSeries(result, function (item, cb) {
        //3. 将内容存储到本地文件
        fs.appendFile('./data/'+item.title, " url: "+item.url+"\n read_num: "+item.read_num+"\n like_num: "+item.like_num+"\n release_time: "+item.release_time+"\n author: "+item.author+"\n wechat_number: "+item.wechat_number+"\n cover: "+item.cover, 'utf-8', function(error) {
            if (error) {
                console.log(error);
            }
            cb();
        });
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('success');
    });
})