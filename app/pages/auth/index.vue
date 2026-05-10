<script setup lang="ts">
import { ref, computed } from 'vue'

const { signIn, status, data } = useAuth()

const isSignUp = ref(false)
const isLoading = ref(false)
const showSignInPass = ref(false)
const showSignUpPass = ref(false)

const signInForm = ref({ name: '', password: '' })
const signUpForm = ref({ name: '', password: '' })

function flip(toSignUp: boolean) {
  isSignUp.value = toSignUp
}

const passwordStrength = computed(() => {
  const p = signUpForm.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score += 25
  if (p.length >= 12) score += 15
  if (/[A-Z]/.test(p)) score += 20
  if (/[0-9]/.test(p)) score += 20
  if (/[^A-Za-z0-9]/.test(p)) score += 20
  return Math.min(score, 100)
})

const strengthClass = computed(() => {
  if (passwordStrength.value < 40) return 'weak'
  if (passwordStrength.value < 70) return 'medium'
  return 'strong'
})

const strengthLabel = computed(() => {
  if (!signUpForm.value.password) return ''
  if (passwordStrength.value < 40) return 'Lemah'
  if (passwordStrength.value < 70) return 'Sedang'
  return 'Kuat'
})

const errorMsg = ref('')

async function handleSignIn() {
  errorMsg.value = ''
  isLoading.value = true
  try {
    const result = await signIn('credentials', {
      name: signInForm.value.name,
      password: signInForm.value.password,
      redirect: false,
    })
    if (result?.error) {
      errorMsg.value = 'Nama atau password salah'
    } else {
      navigateTo('/')
    }
  } finally {
    isLoading.value = false
  }
}

async function handleSignUp() {
  errorMsg.value = ''
  isLoading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: signUpForm.value.name, password: signUpForm.value.password }
    })

    // Langsung login setelah daftar
    await signIn('credentials', {
      name: signUpForm.value.name,
      password: signUpForm.value.password,
      redirect: false
    })

    navigateTo('/')
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? 'Terjadi kesalahan'
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleSignIn() {
  await signIn('google', { callbackUrl: '/' })
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 font-sans">
    <div class="relative z-10 flex w-full flex-col items-center gap-7">
      
      <!-- Flip Card Container -->
      <div class="h-[560px] w-full animate-[fadeUp_0.7s_ease_0.1s_both] perspective-1200 sm:w-[420px] lg:w-[440px]">
        <div 
          class="relative h-full w-full transition-transform duration-700 preserve-3d"
          :class="{ '[transform:rotateY(180deg)]': isSignUp }"
        >
          
          <!-- FRONT: Sign In -->
          <div class="absolute inset-0 backface-hidden">
            <div class="relative h-full overflow-hidden rounded-[24px] bg-[#473e29] p-8 shadow-2xl lg:px-9 lg:py-10 border border-white/5">
              <div class="flex h-full flex-col gap-5">
                <div class="flex flex-col gap-1">
                  <p class="text-[12px] font-medium uppercase tracking-widest text-white/70">Selamat datang kembali di</p>
                  <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-white">CISF</h1>
                </div>

                <form class="flex flex-1 flex-col gap-4" @submit.prevent="handleSignIn">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[12px] font-medium tracking-wide text-white/80" for="signin-name">Nama</label>
                    <div class="group relative flex items-center">
                      <span class="absolute left-3.5 flex items-center text-white/60 group-focus-within:text-[#EEBA4B]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                      <input id="signin-name" v-model="signInForm.name" type="text" placeholder="Masukkan nama" class="h-[48px] w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#EEBA4B]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#EEBA4B]/10" />
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[12px] font-medium tracking-wide text-white/80" for="signin-password">Password</label>
                    <div class="group relative flex items-center">
                      <span class="absolute left-3.5 flex items-center text-white/60 group-focus-within:text-[#EEBA4B]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                      <input id="signin-password" v-model="signInForm.password" :type="showSignInPass ? 'text' : 'password'" placeholder="••••••••" class="h-[48px] w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#EEBA4B]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#EEBA4B]/10" />
                      <button type="button" class="absolute right-3.5 text-white/40 hover:text-white" @click="showSignInPass = !showSignInPass">
                        <svg v-if="!showSignInPass" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      </button>
                    </div>
                  </div>

                  <p v-if="errorMsg" class="text-xs text-red-400 -mt-1">{{ errorMsg }}</p>

                  <button type="submit" class="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-[#EEBA4B] text-[15px] font-bold text-[#473e29] transition-all hover:-translate-y-px hover:shadow-xl active:translate-y-0 disabled:opacity-70" :disabled="isLoading">
                    <span v-if="!isLoading" class="z-10">Masuk</span>
                    <span v-else class="h-5 w-5 animate-spin rounded-full border-2 border-[#473e29]/20 border-t-[#473e29]" />
                    <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </button>

                  <div class="my-1 flex items-center gap-3 text-[12px] text-white/30 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
                    <span>ATAU</span>
                  </div>

                  <button type="button" class="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white transition-all hover:bg-white/10" @click="handleGoogleSignIn">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                </form>

                <p class="mt-auto text-center text-[13px] text-white/60">
                  Belum punya akun?
                  <button type="button" class="font-semibold text-[#EEBA4B] hover:underline" @click="flip(true)">Daftar</button>
                </p>
              </div>
            </div>
          </div>

          <!-- BACK: Sign Up -->
          <div class="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
            <div class="relative h-full overflow-hidden rounded-[24px] bg-[#473e29] p-8 shadow-2xl lg:px-9 lg:py-10 border border-white/5">
              <div class="flex h-full flex-col gap-5">
                <div class="flex flex-col gap-1">
                  <p class="text-[12px] font-medium uppercase tracking-widest text-white/70">Mulai perjalananmu bersama</p>
                  <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-white">CISF</h1>
                </div>

                <form class="flex flex-1 flex-col gap-4" @submit.prevent="handleSignUp">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[12px] font-medium tracking-wide text-white/80" for="signup-name">Nama</label>
                    <div class="group relative flex items-center">
                      <span class="absolute left-3.5 flex items-center text-white/60 group-focus-within:text-[#EEBA4B]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                      <input id="signup-name" v-model="signUpForm.name" type="text" placeholder="Nama lengkap" class="h-[48px] w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#EEBA4B]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#EEBA4B]/10" />
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[12px] font-medium tracking-wide text-white/80" for="signup-password">Password</label>
                    <div class="group relative flex items-center">
                      <span class="absolute left-3.5 flex items-center text-white/60 group-focus-within:text-[#EEBA4B]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                      <input id="signup-password" v-model="signUpForm.password" :type="showSignUpPass ? 'text' : 'password'" placeholder="••••••••" class="h-[48px] w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#EEBA4B]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#EEBA4B]/10" />
                      <button type="button" class="absolute right-3.5 text-white/40 hover:text-white" @click="showSignUpPass = !showSignUpPass">
                        <svg v-if="!showSignUpPass" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      </button>
                    </div>
                    <!-- Strength Bar -->
                    <div class="mt-2 flex flex-col gap-1">
                      <div class="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <div class="h-full transition-all duration-500" :style="{ width: passwordStrength + '%' }" :class="{'bg-red-500': strengthClass === 'weak', 'bg-amber-400': strengthClass === 'medium', 'bg-green-500': strengthClass === 'strong'}" />
                      </div>
                      <span class="text-[9px] uppercase tracking-tighter text-white/40">{{ strengthLabel }}</span>
                    </div>
                  </div>

                  <p v-if="errorMsg" class="text-xs text-red-400 -mt-1">{{ errorMsg }}</p>

                  <button type="submit" class="group relative mt-1 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-[#EEBA4B] text-[15px] font-bold text-[#473e29] transition-all hover:-translate-y-px hover:shadow-xl active:translate-y-0 disabled:opacity-70" :disabled="isLoading">
                    <span v-if="!isLoading" class="z-10">Daftar</span>
                    <span v-else class="h-5 w-5 animate-spin rounded-full border-2 border-[#473e29]/20 border-t-[#473e29]" />
                    <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </button>

                  <div class="my-1 flex items-center gap-3 text-[12px] text-white/30 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
                    <span>ATAU</span>
                  </div>

                  <button type="button" class="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white transition-all hover:bg-white/10" @click="handleGoogleSignIn">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                </form>

                <p class="mt-auto text-center text-[13px] text-white/60">
                  Sudah punya akun?
                  <button type="button" class="font-semibold text-[#EEBA4B] hover:underline" @click="flip(false)">Masuk</button>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1200 { perspective: 1200px; }
.preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>