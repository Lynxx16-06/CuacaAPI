<template>
  <div>
    <nav class="flex justify-around m-auto p-5 container border-b border-gray-400">
      <div class="flex items-center gap-10">
        <div class="flex items-center gap-4">
          <span>{{ dayName }}, {{ time }}</span>
          <h1 class="text-2xl">CuacaHariIni</h1>
        </div>
        <div
          v-if="location"
          class="text-sm flex items-center gap-3 underline text-gray-900 italic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          {{ location }}
        </div>
        <div v-if="error" class="text-red-500 text-sm italic">{{ error }}</div>
      </div>
      <ul class="flex gap-10">
        <!-- Tambahkan Search -->
        <div class="flex gap-2 items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kota..."
            class="border p-1 px-2 rounded text-sm"
          />
          <button @click="searchWeather" class="cursor-pointer text-white px-3 rounded text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

          </button>
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" /></svg>
            <select name="" id="">
              <option value="">Indonesia</option>
              <option value="">Inggris</option>
            </select>
          </div>
        </div>
      </ul>
    </nav>
    <router-view></router-view>
  </div>

</template>

<script>
import eventBus from "./eventBus";

export default {
  data() {
    return {
      location: null,
      error: null,
      dayName: '',
      dateString: '',
      time: '',
      searchQuery: "",
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);

    this.detectLocation();
  },
  methods: {
    updateTime() {
      const now = new Date();

      const dayOptions = { weekday: 'long' };
      this.dayName = now.toLocaleDateString('id-ID', dayOptions);

      const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      this.dateString = now.toLocaleDateString('id-ID', dateOptions);

      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}`;
    },
    getLocationName(lat, lon) {
      const apiKey = "8f3a0fd29e8045b68c8101313251104";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          this.location = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        })
        .catch(() => {
          this.error = "Gagal ambil lokasi";
        });
    },
    detectLocation() {
      if (!navigator.geolocation) {
        this.error = "Geolocation tidak didukung browser.";
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getLocationName(lat, lon);
        },
        () => {
          this.error = "Tidak bisa mendeteksi lokasi.";
        }
      );
    },
    searchWeather() {
      if (!this.searchQuery.trim()) return;
      const apiKey = "8f3a0fd29e8045b68c8101313251104";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.searchQuery}`;

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Kota tidak ditemukan");
          return res.json();
        })
        .then((data) => {
          this.location = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
          this.error = null;

          eventBus.emit("search-weather", data.location.name);
        })
        .catch(() => {
          this.error = "Kota tidak ditemukan.";
        });
    },
  },
};
</script>
