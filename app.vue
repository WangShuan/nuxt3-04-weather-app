<template>
  <div v-if="weatherData" class="h-screen overflow-hidden relative w-100 bg-norepeat bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgimg})` }">
    <div class="z-10 absolute w-full h-full bg-black/20 flex justify-center items-center">
      <div class="text-center font-sans">
        <h1 class="text-3xl md:text-5xl text-white mb-3 md:mb-10">Weather APP</h1>
        <div class="flex justify-center items-center mb-3 md:mb-10 flex-wrap space-y-4">
          <p class="text-xl text-white w-full">
            {{ weatherData.startTime }} 至 {{ weatherData.endTime }}
          </p>
          <h2 class="text-2xl text-white mr-4">{{ weatherData.name }}</h2>
          <div class="flex justify-between items-center">
            <img :src="weatherImg" class="w-12 mr-1" />
            <span class="text-2xl text-white">{{ weatherData.MinT }}~{{ weatherData.MaxT }}°C</span>
          </div>
          <p class="text-white text-xl w-full">
            {{ weatherData.Wx }} / {{ weatherData.CI }} / 降雨機率 {{ weatherData.PoP }} %
          </p>
        </div>
        <div>
          <select v-model="city" @change="handelSearch" class="rounded p-3 text-lg">
            <option value="">請選擇</option>
            <option v-for="cityName in cities" :key="cityName" :value="cityName">{{ cityName }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="h-screen w-screen bg-gray-100 flex items-center justify-center text-center">
      <div class="container px-5 text-gray-700">
        <div class="text-5xl font-dark font-bold mb-3">Oops,</div>
        <p class="text-2xl md:text-3xl font-light leading-normal mb-3">Something went wrong!</p>
        <p class="text-xl mb-8">City is not found.</p>
        <button @click="goBack" class="px-4 py-2 text-sm shadow text-white rounded-lg bg-blue-600 hover:bg-blue-700">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cities, weatherConditions } from "@/data";

useHead({
  title: "Weather APP"
});

const config = useRuntimeConfig();
const bgimg = ref("");
const weatherImg = ref("");

const cookie = useCookie("city")
if (!cookie.value) cookie.value = "基隆市";

const city = ref(cookie.value);

const { data: weatherData, error } = useAsyncData("city", async () => {
  if (!city.value) {
    return;
  }
  let response, d, obj;
  response = await $fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001", {
    params: {
      Authorization: config.public.WEATHER_API_KEY,
      limit: 1,
      locationName: city.value
    }
  }) as Response;

  cookie.value = city.value;

  d = response.records.location[0];
  obj = Object.fromEntries(d.weatherElement.map(obj => [obj.elementName, obj.time[0].parameter.parameterName]));

  for (const condition of weatherConditions) {
    if (obj.Wx.indexOf(condition.condition) !== -1) {
      weatherImg.value = condition.weatherImg;
      bgimg.value = condition.bgimg;
      break;
    }
  }
  const t = d.weatherElement[0].time[0];
  const st = new Date(t.startTime).toLocaleDateString();
  const sh = new Date(t.startTime).getUTCHours() + 8

  const et = new Date(t.endTime).toLocaleDateString();
  const eh = new Date(t.endTime).getUTCHours() + 8
  return {
    name: d.locationName,
    startTime: `${st} ${sh % 24}時`,
    endTime: `${et} ${eh % 24}時`,
    ...obj
  } as WeatherData;

}, {
  watch: [city]
});

const goBack = () => {
  city.value = cookie.value ?? "基隆市";
}
</script>