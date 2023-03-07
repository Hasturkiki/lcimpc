<template>
  <div class="index-container" v-show="loginFlag">
    <el-form
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
      class="index-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginData.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip
        :disabled="capslockTooltipDisabled"
        :content="$t('login.capsLock')"
        placement="right"
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            ref="passwordRef"
            :key="passwordType"
            v-model="loginData.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup="checkCapslock"
            @blur="capslockTooltipDisabled = true"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        size="default"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 12px"
        @click.prevent="handleLogin"
      >{{ $t('login.login') }}
      </el-button>

      <!-- 注册跳转 -->
      <div class="tips">
        <div style="position: relative">
          <a @click="loginFlagAlter">{{ $t('login.registerTip') }}</a>
        </div>
      </div>
    </el-form>
  </div>

  <div class="index-container" v-show="!loginFlag">
    <el-form
      ref="registerFormRef"
      :model="registerData"
      :rules="registerRules"
      class="index-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="registerData.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip
        :disabled="capslockTooltipDisabled"
        :content="$t('login.capsLock')"
        placement="right"
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            ref="passwordRef"
            :key="passwordType"
            v-model="registerData.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup="checkCapslock"
            @blur="capslockTooltipDisabled = true"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="type">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-tree-select
          ref="type"
          v-model="registerData.type"
          :data="typeOptionsSelect"
          :placeholder="$t('login.type')"
          name="type"
          tabindex="3"
          class="registerType"
        />
      </el-form-item>

      <el-form-item prop="telephone">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="telephone"
          v-model="registerData.telephone"
          :placeholder="$t('login.telephone')"
          name="telephone"
          type="text"
          tabindex="4"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="email"
          v-model="registerData.email"
          :placeholder="$t('login.email')"
          name="email"
          type="text"
          tabindex="5"
          auto-complete="on"
        />
      </el-form-item>

      <el-button
        size="default"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 12px"
        @click.prevent="handleRegister"
      >{{ $t('login.register') }}
      </el-button>

      <!-- 登录跳转 -->
      <div class="tips">
        <div style="position: relative">
          <a @click="loginFlagAlter">{{ $t('login.loginTip') }}</a>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, toRefs, watch, nextTick} from 'vue'

// 组件依赖
import {ElForm, ElInput, ElMessage} from 'element-plus'
import router from '@/router';
import LangSelect from '@/components/LangSelect/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 状态管理依赖
import {useUserStore} from '@/store/modules/user'

// API依赖
import {useRoute} from 'vue-router'
import {LoginData, RegisterData} from '@/api/auth/types'
import {registerApi} from '@/api/auth'

import i18n from '@/lang/index'

const {t} = i18n.global

const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const registerFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

//  切换登录与注册
function loginFlagAlter() {
  loginFlag.value = !loginFlag.value
}

const state = reactive({
  redirect: '',
  loginData: {} as LoginData,
  registerData: {} as RegisterData,
  loginRules: {
    username: [{required: true, trigger: 'blur'}],
    password: [{required: true, trigger: 'blur', validator: validatePassword}]
  },
  registerRules: {
    username: [{required: true, trigger: 'blur'}],
    password: [{required: true, trigger: 'blur', validator: validatePassword}],
    type: [{required: true, message: '用户类型不能为空', trigger: 'blur'}],
    telephone: [
      {
        pattern: /^[1][3-9][0-9]{9}$/,
        message: '请输入正确的联系方式',
        trigger: 'blur'
      }
    ],
    email: [
      {
        pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        message: '请输入正确的电子邮箱地址',
        trigger: 'blur'
      }
    ]
  },
  typeOptionsSelect: [{value: 1, label: t('login.typeOne')}, {value: 2, label: t('login.typeTwo')}],
  loading: false,
  passwordType: 'password',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
  showDialog: false,
  loginFlag: true
});

function validatePassword(rule: any, value: any, callback: any) {
  if (value != null)
    if (value.length < 6) {
      callback(new Error(t('login.passwordTip')));
    } else {
      callback();
    }
}

const {
  loginData,
  registerData,
  loginRules,
  registerRules,
  typeOptionsSelect,
  loading,
  passwordType,
  capslockTooltipDisabled,
  loginFlag
} = toRefs(state);

function checkCapslock(e: any) {
  const {key} = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z';
}

function showPwd() {
  if (passwordType.value === 'password') {
    passwordType.value = '';
  } else {
    passwordType.value = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

/*  登录  */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      userStore
        .login(state.loginData)
        .then(() => {
          router.push({path: state.redirect || '/', query: state.otherQuery});
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

/*  注册  */
function handleRegister() {
  registerFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      registerApi(state.registerData).then(({data}) => {
        state.loading = false
        ElMessage.success(data.username + '创建成功')
        state.loginFlag = true
        state.loginData.username = data.username
      }).catch(() => {
        state.loading = false
      })
    } else {
      return false
    }
  })
}

watch(route, () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  window.onresize = () => {
    state.showCopyright = state.clientHeight <= document.documentElement.clientHeight;
  };
});
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-plus css */
.index-container {
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: -8px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    height: 36px;
    width: 85%;

    .el-input__wrapper {
      padding: 0 1%;
      background: transparent;
      box-shadow: none;
      width: 100%;

      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        height: 36px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: var(--el-input-hover-border, var(--el-border-color-hover));
      box-shadow: none;
    }

    box-shadow: none;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
}
</style>

<style lang="scss" scoped>
$bg: #233;
$dark_gray: #abc;
$light_gray: #eee;

.index-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .index-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .registerType {
      width: 93%;

      :deep(.el-input) {
        width: 100%;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }

    a {
      display: flex;
      flex-direction: row-reverse;
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 24px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
</style>
