# Nuxt3-project4 Weather App

原始碼：https://github.com/WangShuan/nuxt3-04-weather-app

## 建立與啟動 Nuxt 專案

開啟終端機，`cd` 到桌面或任何希望創建該專案的位置
執行命令： 
```shell
npx nuxi init 04-weather-app
```

完成後，根據提示
先 `cd` 到專案目錄 `04-weather-app` 中
執行命令：
```shell
npm install
```
安裝所有依賴項目
此時會發現專案目錄中**生成了 `node_modules` 資料夾**

確認您的專案已成功安裝好所有依賴後
即可執行命令：
```shell
npm run dev
```
啟動 Nuxt 應用程序。

## 專案說明

本專案將使用線上的免費天氣 API 來發送 HTTP 請求並獲取數據渲染於頁面上

這邊使用氣象資料開放平臺中的 [**一般天氣預報-今明36小時天氣預報**](https://opendata.cwb.gov.tw/dataset/forecast/F-C0032-001)
需要先註冊成為會員以獲取**氣象開放資料平台會員授權碼**才能使用 API

---

在 Nuxt3 中可以通過內建的兩種方法進行發送請求並獲取數據
第一種是使用 useFetch：
宣告一個解構物件接收 useFetch，通常都是 { data, error } 分別接收數據以及錯誤
useFetch 第一個是 request url，第二個參數為可選參數(可參考[官網說明](https://nuxt.com/docs/api/composables/use-fetch))

主要用法如下：
```typescript
// 1. 直接將網址做為參數傳入則只執行一次
const { data, error } = useFetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-E2667CA9-47FD-43B1-8988-0FCACBBEF88F&limit=1&locationName=${city.value}`)

// 2. 用函數做為參數傳入，並在函數中回傳網址則每次網址發生變動時觸發執行
const { data, error } = useFetch(() => `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-E2667CA9-47FD-43B1-8988-0FCACBBEF88F&limit=1&locationName=${city.value}`)
```

---

第二種是使用 useAsyncData：
宣告一個解構物件接收 useAsyncData，通常都是 { data, error } 分別接收數據以及錯誤
useAsyncData 第一個參數是不重複的唯一 key 值，第二個參數為 async 函數，並且在函數中使用 await $fetch() 方法獲取資料

主要用法如下：
```typescript
// 1. 建立參數 response 接收數據結果，再將整理好的數據結構通過 return 導出為實際的 data
const { data: weatherData, error } = useAsyncData('city', async () => {
  const response = await $fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&limit=1&locationName=${city.value}`);

  return {
    // data here
  }
})

// 2-1. 設定第三個參數為物件，在裡面傳入 wacth 為陣列，當陣列中監聽的對象發生改變就進行重新獲取數據
const { data: weatherData, error } = useAsyncData('city', async () => {
  const response = await $fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&limit=1&locationName=${city.value}`);

  return {
    // data here
  }
}, {
  watch: [
    city
  ]
})

// 2-2. 在最開頭宣告 refresh，並在需要時調用 refresh() 進行重新獲取數據
const { data: weatherData, refresh, error } = useAsyncData('city', async () => {
  const response = await $fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&limit=1&locationName=${city.value}`);

  return {
    // data here
  }
})
const handelSearch = () => { // 將該函數綁定在 change 或 click 等事件中進行觸發
  refresh()
}
```

> 這邊的 apiKey 屬於機密，請記得設為 env 使用
> 可參考官方說明：https://nuxt.com/docs/guide/going-further/runtime-config

## 知識點

1. 在 Nuxt 中 useCookie() 可輕易用來獲取與設置 cookie
```typescript
const cookie = useCookie("city")
if (!cookie.value) cookie.value = "基隆市";

const city = ref(cookie.value);
```
2. 可於項目根目錄中新增 /types/index.ts 存放全局使用的 interface
```typescript
interface WeatherCondition {
  condition: string,
  weatherImg: string,
  bgimg: string
}
```
3. 聲明好的數據資料可於項目根目錄中新增檔案 data.ts 並在裡面通過 export const xxx = xxx 來導出使用
```typescript
export const weatherConditions: WeatherCondition[] = [
  {
    condition: '晴天',
    weatherImg: 'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/01.svg',
    bgimg: '/img/sunny.jpeg'
  },
  {
    condition: '多雲',
    weatherImg: 'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/04.svg',
    bgimg: '/img/coulds.jpeg'
  },
  ...
];
```