<template>
  <div class="md:h-full h-screen">
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="weather" class="">
      <main class="md:flex justify-around gap-10 mt-79 md:ml-20 hidden">
        <!-- Bagian cuaca saat ini -->
        <section class="flex gap-10 items-center">
          <div class="flex flex-col items-center">
            <img
              class="w-30 h-30"
              :src="'https:' + weather.current.condition.icon"
            />
            <div class="text-xs">
              <p>Kelembaban: {{ weather.current.humidity }}%</p>
              <p>Angin: {{ weather.current.wind_kph }} km/jam</p>
            </div>
          </div>
          <div>
            <h1 class="text-3xl font-bold">
              Cuaca di {{ weather.location.name }}
            </h1>
            <p class="text-2xl">Suhu: {{ weather.current.temp_c }}°C</p>
            <p>Cuaca: {{ weather.current.condition.text }}</p>
          </div>
        </section>

        <section>
          <h1 class="text-2xl font-bold my-5">Lainnya:</h1>
          <div class="flex flex-col gap-2 text-gray-200">
            <p>Terasa Seperti: {{ weather.current.feelslike_c }}°C</p>
            <p>Tekanan Udara: {{ weather.current.pressure_mb }} mb</p>
            <p>Arah Angin: {{ weather.current.wind_dir }}</p>
            <p>Index UV: {{ weather.current.uv }}</p>
          </div>
        </section>

        <!-- Bagian per jam -->
        <section
          class="flex shadow p-10 backdrop-blur-md overflow-x-auto hide-scrollbar md:w-[870px]"
        >
          <div
            v-for="(hour, index) in filteredHourlyForecast"
            :key="index"
            class="p-3 min-w-[150px] min-h-[40px] text-center rounded mx-1 text-white"
          >
            <p class="text-sm font-semibold">{{ formatHour(hour.time) }}</p>
            <img
              :src="'https:' + hour.condition.icon"
              class="mx-auto my-1 w-10 h-10"
            />
            <!-- <p class="text-xs">{{ hour.condition.text }}</p> -->
            <p class="text-xs">{{ hour.temp_c }}°C</p>
          </div>
        </section>
      </main>

      <!-- Mobile -->

      <main class="md:hidden">
        <section class="mb-10">
          <div class="flex flex-col items-center justify-center mt-10">
            <img
              class="w-40 h-40 mb-20"
              :src="'https:' + weather.current.condition.icon"
            />
            <div class="flex flex-col items-center">
              <h1 class="text-3xl font-bold md:flex hidden">
                {{ weather.location.name }}
              </h1>
              <p class="text-5xl font-bold">{{ weather.current.temp_c }}°C</p>
              <p>Kelembaban: {{ weather.current.humidity }}%, Angin: {{ weather.current.wind_kph }} km/jam</p>
              <!-- <p>Cuaca: {{ weather.current.condition.text }}</p> -->
            </div>
          </div>
          <!-- <div class="flex flex-col items-center">
          </div> -->
        </section>

        <main class="p-3">
          <section
            class="flex shadow p-5 backdrop-blur-md rounded-2xl overflow-x-auto hide-scrollbar md:w-full"
          >
            <div
              v-for="(hour, index) in filteredHourlyForecast"
              :key="index"
              class="p-2 min-w-[100px] min-h-[40px] text-center rounded mx-1 text-white"
            >
              <p class="text-sm font-semibold">{{ formatHour(hour.time) }}</p>
              <img
                :src="'https:' + hour.condition.icon"
                class="mx-auto my-1 w-10 h-10"
              />
              <!-- <p class="text-xs">{{ hour.condition.text }}</p> -->
              <p class="text-xs">{{ hour.temp_c }}°C</p>
            </div>
          </section>
        </main>

        <main class="p-5">
          <footer class="">
          <div
            class="text-white shadow-2xl backdrop-blur-md md:block overflow-y-auto h-[400px] rounded-2xl"
          >
            <!-- <h2 class="text-xl mb-4">Cuaca Beberapa Hari ke Depan:</h2> -->
            <div class="flex flex-col gap-5 justify-around overflow-y-auto">
              <div
                v-for="(day, index) in weather.forecast.forecastday"
                :key="index"
                @click="selectForecastDay(index)"
                :class="[
                  'cursor-pointer p-5 rounded-xs text-center min-w-[100px] transition duration-200', selectedForecastIndex === index ? '' : 'hover:border-t-4 border-amber-400 transition-all duration-200',
                ]"
              >
              <div class="flex">
                <p class="font-semibold">{{ formatDate(day.date) }}</p>
                <img :src="'https:' + day.day.condition.icon" class="w-10 h-10 mx-auto my-1"/>
                <!-- <p class="text-sm">{{ day.day.condition.text }}</p> -->
                <p class="text-sm">{{ day.day.avgtemp_c }}°C</p>
              </div>
              </div>
            </div>
          </div>
        </footer>
        </main>


        <main class="text-white">
          <main class="flex mb-3">
            <div class="backdrop-blur-2xl bg-black rounded-2xl w-full mx-5 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M9 16a3.001 3.001 0 0 0 6 0c0-.353-.072-.686-.184-1H9.184A2.962 2.962 0 0 0 9 16z"></path><path d="M18 6V4h-3.185A2.995 2.995 0 0 0 12 2c-1.654 0-3 1.346-3 3v5.8A6.027 6.027 0 0 0 6 16c0 3.309 2.691 6 6 6s6-2.691 6-6a6.027 6.027 0 0 0-3-5.2V10h3V8h-3V6h3zm-4.405 6.324A4.033 4.033 0 0 1 16 16c0 2.206-1.794 4-4 4s-4-1.794-4-4c0-1.585.944-3.027 2.405-3.676l.595-.263V5a1 1 0 0 1 2 0v7.061l.595.263z"></path></svg>
              <span class="text-xs">Terasa Seperti</span>
              <p>{{ weather.current.feelslike_c }}°C</p>
            </div>
            <div class="backdrop-blur-2xl bg-black rounded-2xl w-full mx-5 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.344 7.759 4.223 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"></path></svg>
              <span class="text-xs">UV</span>
              <p>{{ weather.current.uv }}</p>
            </div>
          </main>
          <main class="flex">
            <div class="backdrop-blur-2xl bg-black rounded-2xl w-full mx-5 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M18.277 8c.347.596.985 1 1.723 1a2 2 0 0 0 0-4c-.738 0-1.376.404-1.723 1H16V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H5.723C5.376 5.404 4.738 5 4 5a2 2 0 0 0 0 4c.738 0 1.376-.404 1.723-1H8v.369C5.133 9.84 4.318 12.534 4.091 14H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-.877c.197-.959.718-2.406 2.085-3.418A.984.984 0 0 0 9 11h6a.98.98 0 0 0 .792-.419c1.373 1.013 1.895 2.458 2.089 3.419H17a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1.092c-.227-1.466-1.042-4.161-3.908-5.632V8h2.277zM6 18H4v-2h2v2zm14 0h-2v-2h2v2zm-6-9h-4V5h4v4z"></path></svg>
              <span class="text-xs">Tekanan Udara</span>
              <p>{{ weather.current.pressure_mb }}</p>
            </div>
            <div class="backdrop-blur-2xl bg-black rounded-2xl w-full mx-5 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="m8 16 5.991-2L16 8l-6 2z"></path></svg>
              <span class="text-xs">Arah Angin</span>
              <p>{{ weather.current.wind_dir }}</p>
            </div>
          </main>
        </main>
      </main>

      <!-- Footer: Prakiraan beberapa hari ke depan -->
      <footer class="mt-30">
        <div
          class="text-white shadow-2xl backdrop-blur-md hidden md:block"
        >
          <!-- <h2 class="text-xl mb-4">Cuaca Beberapa Hari ke Depan:</h2> -->
          <div class="flex gap-5 justify-around overflow-x-auto">
            <div
              v-for="(day, index) in weather.forecast.forecastday"
              :key="index"
              @click="selectForecastDay(index)"
              :class="[
                'cursor-pointer p-12 rounded-xs text-center min-w-[100px] transition duration-200', selectedForecastIndex === index ? 'border-t-4 border-amber-400' : 'hover:border-t-4 border-amber-400 transition-all duration-200',
              ]"
            >
              <p class="font-semibold">{{ formatDate(day.date) }}</p>
              <img
                :src="'https:' + day.day.condition.icon"
                class="w-10 h-10 mx-auto my-1"
              />
              <p class="text-sm">{{ day.day.condition.text }}</p>
              <p class="text-sm">{{ day.day.avgtemp_c }}°C</p>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <div v-else class="flex items-center justify-center mt-80">
      <svg
        class="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        style="fill: rgba(255, 255, 255, 1)"
      >
        <path
          d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import eventBus from "../eventBus.js"; // pastikan sesuai path

export default {
  data() {
    return {
      weather: null,
      error: null,
      selectedDayIndex: 0,
      activeItem: null,
      selectedForecastIndex: 0,
    };
  },
  computed: {
    filteredHourlyForecast() {
      if (!this.weather || !this.weather.forecast) return [];
      const now = new Date();
      const currentHour = now.getHours();

      const forecastDay =
        this.weather.forecast.forecastday[this.selectedDayIndex];
      return forecastDay.hour.filter((hourData) => {
        const hour = new Date(hourData.time).getHours();
        return this.selectedDayIndex === 0 ? hour >= currentHour : true;
      });
    },
  },
  methods: {
    selectForecastDay(index) {
      this.selectedForecastIndex = index;
    },
    selectForecastDay(index) {
      this.selectedDayIndex = index;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    },
    formatHour(timeStr) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    detectLocation() {
      if (!navigator.geolocation) {
        this.error = "Geolocation tidak didukung oleh browser.";
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getWeatherByLocation(lat, lon);
        },
        () => {
          this.error = "Gagal mendeteksi lokasi. Mohon izinkan akses lokasi.";
        }
      );
    },
    getWeatherByLocation(lat, lon) {
      const apiKey = "8f3a0fd29e8045b68c8101313251104";
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data");
          return res.json();
        })
        .then((data) => {
          this.weather = data;
        })
        .catch((err) => {
          this.error = err.message || "Gagal mengambil data cuaca.";
          console.error(err);
        });
    },
    getWeatherByCity(city) {
      const apiKey = "8f3a0fd29e8045b68c8101313251104";
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data");
          return res.json();
        })
        .then((data) => {
          this.weather = data;
          this.error = null;
        })
        .catch((err) => {
          this.error = err.message || "Gagal mengambil data cuaca.";
          console.error(err);
        });
    },
  },
  mounted() {
    this.detectLocation();

    // Terima hasil dari navbar
    eventBus.on("search-weather", (cityName) => {
      this.getWeatherByCity(cityName);
    });
  },
};
</script>
