#!/usr/bin/env node

let fs = require('fs');
let prodConfig =  require("./src/productionConfig"); 

let textColor = (prodConfig.text || {}).color || {};
let umeng = prodConfig.umeng || {};
let title = prodConfig.title || '',
    og_image_url = prodConfig.ogImageUrl || 'ogImageUrl',
    og_title = prodConfig.ogTitle || 'ogImageUrl',
    og_description = prodConfig.ogDescription || 'ogDescription',
    theme_color = prodConfig.themeColor || '#3264fd',
    text_color_first = textColor.first || '#171D44',
    text_color_second = textColor.second || '#787C99',
    text_color_third = textColor.third || '#C0C4CC',
    text_color_fourth = textColor.fourth || 'rgba(255,255,255,0.5)',
    text_color_link = textColor.link || '#3264fd',
    button_color_common = ((prodConfig.button || {}).color || {}).common || 'white',
    button_bgColor_common = ((prodConfig.button || {}).bgColor || {}).common || '#3264FD',
    background_color_common = prodConfig.background || '#F8F8F8',
    tag_color_common = prodConfig.tagBackground ||'rgba(239, 243, 255, 1)',
    table_tr_color_common = prodConfig.tableTrColor ||'rgba(50, 100, 253, 0.3)',
    table_tr_color_common_hover = prodConfig.tableTrHoverColor ||'rgba(50, 100, 253, 0.3)',
    umengId = umeng.umengId || 'umengId',
    umengWebId = umeng.umengWebId || 'umengWebId';

replaceEnv([
        "./public/index.html",
        "./src/style/productization.scss",
    ],
    {
        title : title,
        theme_color:theme_color,
        text_color_first : text_color_first,
        text_color_second : text_color_second,
        text_color_third : text_color_third,
        text_color_fourth : text_color_fourth,
        text_color_link : text_color_link,
        button_color_common : button_color_common,
        button_bgColor_common : button_bgColor_common,
        background_color_common : background_color_common,
        tag_color_common : tag_color_common,
        table_tr_color : table_tr_color_common,
        table_tr_color_hover :table_tr_color_common_hover,
        ogImageUrl : og_image_url,
        ogTitle : og_title,
        ogDescription : og_description,
        umengId: umengId,
        umengWebId: umengWebId
    }
);


function replaceEnv(files, params) {
    files.forEach(function(file,index){
        let result = fs.readFileSync(file).toString();
        for (let key in params) {
            let r = "\\${"+key+"}";
            result = result.replace(new RegExp(r,"g"), params[key]);
        }
        fs.writeFileSync(file, result)
    });
}