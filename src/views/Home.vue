<template>
  <div>
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
        <section class="">
          <div class="flex flex-col items-center mt-40">
            <img
              class="w-30 h-30 mb-20"
              :src="'https:' + weather.current.condition.icon"
            />
            <div class="flex flex-col items-center">
              <h1 class="text-3xl font-bold">
                {{ weather.location.name }}
              </h1>
              <p class="text-2xl">Suhu: {{ weather.current.temp_c }}°C</p>
              <!-- <p>Cuaca: {{ weather.current.condition.text }}</p> -->
            </div>
          </div>
          <div class="flex flex-col items-center">
            <p>Kelembaban: {{ weather.current.humidity }}%</p>
            <p>Angin: {{ weather.current.wind_kph }} km/jam</p>
          </div>
        </section>
      </main>

      <!-- Footer: Prakiraan beberapa hari ke depan -->
      <footer class="mt-40">
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
