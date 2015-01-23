define([], function () {
    var ctor = function(spec) {

        var defaultTranslations = [
                { key: "[course]", value: "课程：" },
                { key: "[start course]", value: "开始课程" },
                { key: "[finish course]", value: "结束课程" },
                { key: "[learning objectives]", value: "学习目标：" },
                { key: "[start]", value: "开始" },
                { key: "[home]", value: "主页" },
                { key: "[learning content]", value: "学习内容" },
                { key: "[submit]", value: "提交" },
                { key: "[try again]", value: "重试" },
                { key: "[next]", value: "下一步" },
                { key: "[correct answer]", value: "答案正确" },
                { key: "[incorrect answer]", value: "答案错误" },
                { key: "[previous question]", value: "前一页" },
                { key: "[next question]", value: "下一步" },
                { key: '[of]', value: '只' },
                { key: '[to complete]', value: '完成' },
                { key: "[text matching question hint]", value: "把选项从右列拖到左边以配对" },
                { key: "[text matching question drop here]", value: "放到这里" },
                { key: "[statement question true text]", value: "正确" },
                { key: "[statement question false text]", value: "错误" },
                { key: "[drag and drop question all texts are placed]", value: "所有文本归位" },
                { key: "[drag and drop question drop here]", value: "放到这里" },
                { key: "[fill in the blank choose answer]", value: "选择答案…" },
                { key: "[thank you message]", value: "谢谢，你现在可以关闭此页面。" },
                { key: "[there are no questions]", value: "没有问题" },
                { key: "[browser not supported]", value: "你的浏览器不支持" },
                { key: "[browser not supported hint]", value: "别担心，有简答的修复方法。你只需要点击下面的其中一个按钮，跟着提示操作就可以了。" },
                { key: "[page not found title]", value: "页面没找到（404）" },
                { key: "[page not found message]", value: "Sorry，你要找的页面没有发现。请检查URL是否有错误，请使用上面的导航栏或点击下面的“主页”链接。" },
                { key: "[tracking and tracing header]", value: "你的用来跟踪进度的证书" },
                { key: "[tracking and tracing hint]", value: "请输入你的证书然后点击“开始并报告我的结果”以启动结果跟踪，否则，点击“不报告，只是开始”。" },
                { key: "[tracking and tracing name field]", value: "你的姓名" },
                { key: "[tracking and tracing email field]", value: "你的e-mail" },
                { key: "[tracking and tracing name is not valid]", value: "输入你的姓名" },
                { key: "[tracking and tracing email is not valid]", value: "输入有效的e-mail" },
                { key: "[tracking and tracing skip reporting]", value: "不报告，只是开始" },
                { key: "[tracking and tracing start]", value: "开始并报告我的结果" },
                { key: "[tracking and tracing error]", value: "出错了" },
                { key: "[tracking and tracing error hint]", value: "如果你不重新开始，仍然继续，你的学习结果将不会被报告。" },
                { key: "[tracking and tracing restart course]", value: "重新开始课程" },
                { key: "[tracking and tracing continue anyway]", value: "仍然继续" },
                { key: "[tracking and tracing reporting progress]", value: "正在报告结果" }
        ];

        if (!_.isNullOrUndefined(spec) && !_.isNullOrUndefined(spec.translations)) {
            spec.translations = mapTranslations(spec.translations);
        }
        
        function mapTranslations(translations) {
            return translations.concat(_.difference(defaultTranslations, translations));
        }

        var templateSetting = _.defaults(spec, {
            "logo": {
                "url": ""
            },
            "theme": {
                "key": ""
            },
            "xApi": {
                "enabled": true,
                "selectedLrs": "default",
                "lrs": {
                    "uri": "",
                    "credentials": {
                        "username": "",
                        "password": ""
                    },
                    "authenticationRequired": false
                },
                "allowedVerbs": []
            },
            "masteryScore": {
                "score": "100"
            },
            "translations": defaultTranslations
        });

        return templateSetting;
    };

    return ctor;

});