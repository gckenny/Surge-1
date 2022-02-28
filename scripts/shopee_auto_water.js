const waterRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/water?t=' + new Date().getTime(),
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: $persistentStore.read('ShopeeCrop'),
};

$httpClient.post(waterRequest, function (error, response, data) {
  if (error) {
    $notification.post('🍤 蝦皮自動澆水',
      '',
      '連線錯誤‼️'
    );
  } else {
    if (response.status === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          const useNumber = obj.data.useNumber;
          const state = obj.data.crop.state;
          const exp = obj.data.crop.exp;
          const levelExp = obj.data.crop.meta.config.levelConfig[state.toString()].exp;
          const remain = levelExp - exp;
          $notification.post('🍤 蝦皮自動澆水成功 ✅',
            '本次澆了：' + useNumber + ' 滴水💧',
            '剩餘 ' + remain + ' 滴水成長至下一階段🌳'
          );
        } else if (obj.msg === 'resource not enough') {
          $notification.post('🍤 蝦皮自動澆水',
            '',
            '水壺目前沒水‼️'
          );
        } else if (obj.msg === 'invalid param') {
          $notification.post('🍤 蝦皮自動澆水',
            '',
            '種植作物錯誤，請先手動澆水一次‼️'
          );
        } else {
          $notification.post('🍤 蝦皮自動澆水',
            '',
            obj.msg
          );
        }
      } catch (error) {
        $notification.post('🍤 蝦皮自動澆水',
          '',
          '澆水失敗‼️' + error
        );
      }
    } else {
      $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
        '',
        '請重新更新 Cookie 重試 🔓'
      );
    }
  }
  $done();
});