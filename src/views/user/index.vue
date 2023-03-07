<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
//  Api引入
import userApi from '@/api/user'
import {useUserStoreHook} from "@/store/modules/user";

import {
  reactive,
  ref,
  onMounted,
  toRefs
} from 'vue';
import {
  ElForm,
  ElMessageBox,
  ElMessage
} from 'element-plus';
import {
  User,
  UserFilled,
  Iphone,
  Message,
  Clock,
  ChatDotRound
} from '@element-plus/icons-vue'
import {
  UserForm,
  UserType
} from '@/api/user/types';
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const size = ref('')
const dataFormRef = ref(ElForm);  //  用户表单

const userStore = useUserStoreHook(); //  用户状态信息
const state = reactive({
  //  遮罩层
  loading: true,
  userId: userStore.id,
  type: userStore.type,
  username: userStore.username,
  userInfo: {
    createTime: ''
  } as UserType,
  dialog: {
    visible: false
  } as DialogType,
  //  用户类型下拉项
  typeOptionsSelect: [{value: 1, label: "企业"}, {value: 2, label: "主播"}],
  formData: {
    isEnabled: true
  } as UserForm,
  rules: {
    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
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
  }
});

const {
  loading,
  userId,
  type,
  username,
  userInfo,
  dialog,
  typeOptionsSelect,
  formData,
  rules
} = toRefs(state);

//  获取用户个人信息
function UserInfo() {
  state.loading = true
  userApi.getUserForm(state.userId).then(({data}) => {
    state.userInfo = data
    state.loading = false
  })
}

//  重置密码
function resetPassword() {
  ElMessageBox.prompt(
    '请输入新密码',
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(({value}) => {
      if (!value) {
        ElMessage.warning('密码不可为空');
        return false;
      } else if (!new RegExp('^[A-Za-z0-9]{6,16}$').test(value)) {
        ElMessage.warning('密码为6~16个英文或数字');
        return false;
      }
      userApi.updateUserPassword(state.userId, value).then(() => {
        userStore
          .logout()
          .then(() => {
            ElMessage.success('密码重置成功，新密码是：' + value)
          })
          .then(() => {
            router.push(`/login?redirect=${route.fullPath}`);
          });
      });
    })
    .catch(() => {
    });
}

//  修改用户
async function updateUser() {
  dialog.value = {
    title: '修改用户',
    visible: true
  };

  userApi.getUserForm(state.userId).then(({data}) => {
    formData.value = data;
  });
}

//  表单提交
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      userApi.updateUser(state.formData).then(() => {
        ElMessage.success('修改用户成功');
        if(state.username !== state.formData.username) {
          userStore
            .logout()
            .then(() => {
              ElMessage.success('检测到用户名已修改，请重新登录');
            })
            .then(() => {
              router.push(`/login?redirect=${route.fullPath}`);
            });
        } else {
          closeDialog();
          UserInfo();
        }
      });
    }
  });
}

//  注销账号
function deleteUser() {
  ElMessageBox.confirm(
    '是否确认注销账号',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(function () {
      userApi.deleteUsers(state.userId.toString()).then(() => {
        ElMessage.success('注销账号成功');
        userStore
          .logout()
          .then(() => {
            router.push(`/login?redirect=${route.fullPath}`);
          });
      });
    })
    .catch(() => ElMessage.info('已取消操作'));
}

//  关闭用户弹窗
function closeDialog() {
  dialog.value.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.value.id = undefined;
}

onMounted(() => {
  //  初始化用户数据
  UserInfo();
});
</script>

<template>
  <div class="app-container">
    <el-tag class="user-show-tag" color="#cfc3" type="success" round>用户信息页</el-tag>
    <el-radio-group v-model="size" class="size-select">
      <el-radio label="large">大</el-radio>
      <el-radio>中</el-radio>
      <el-radio label="small">小</el-radio>
    </el-radio-group>
    <!-- 用户数据 -->
    <el-descriptions
      class="margin-set"
      title="UserInfo"
      :column="1"
      :size="size"
      border
    >
      <template #extra>
        <el-button type="primary" @click="updateUser">编辑</el-button>
        <el-button type="warning" @click="resetPassword">重置密码</el-button>
        <el-button type="danger" @click="deleteUser">注销用户</el-button>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <User/>
            </el-icon>
            用户名称
          </div>
        </template>
        {{ userInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <UserFilled/>
            </el-icon>
            用户类型
          </div>
        </template>
        <span v-if="userInfo.type === 1" style="color: #7c7">企业</span>
        <span v-else style="color: #c7c">主播</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone/>
            </el-icon>
            联系方式
          </div>
        </template>
        {{ userInfo.telephone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Message/>
            </el-icon>
            电子邮箱
          </div>
        </template>
        {{ userInfo.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <ChatDotRound/>
            </el-icon>
            个性签名
          </div>
        </template>
        {{ userInfo.signature }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Clock/>
            </el-icon>
            创建时间
          </div>
        </template>
        {{ userInfo.createTime.replace('T', '  ').replaceAll('-', '/') }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 用户表单 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名称"
          />
        </el-form-item>

        <el-form-item label="用户类型" prop="type">
          <el-tree-select
            placeholder="请选择用户类型"
            v-model="formData.type"
            :data="typeOptionsSelect"
            disabled
          />
        </el-form-item>

        <el-form-item label="联系方式" prop="telephone">
          <el-input
            v-model="formData.telephone"
            placeholder="请输入联系方式"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入电子邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="个性签名" prop="signature">
          <el-input
            v-model="formData.signature"
            placeholder="请输入个性签名"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="用户状态" prop="isEnabled">
          <el-radio-group v-model="formData.isEnabled" disabled>
            <el-radio :label=true>正常</el-radio>
            <el-radio :label=false>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-show-tag {
  display: flex;
  line-height: 42px;
  font-size: 24px;
  height: 64px;
  cursor: pointer;
  width: 52%;
  margin: 0 auto 16px;
}

.size-select {
  margin: 1% 9%;
  display: flex;
  justify-content: center;
  background-color: #def7;
  border-radius: 23.3px;
  border: 3px dotted #abc4;
}

.margin-set {
  margin: 1% 9% 9%;
  padding: 1%;
  background-color: #eee5;

  .cell-item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    line-height: 36px;
  }

  :deep(.el-descriptions__cell.el-descriptions__content.is-bordered-content) {
    text-align: center;
    font-size: 18px;
    line-height: 36px;
    font-family: system-ui, serif;
    font-weight: 1000;
  }
}
</style>
