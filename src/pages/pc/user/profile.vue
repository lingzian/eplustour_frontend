<template>
  <div>
      <!-- 基本信息 -->
      <div class="profile-title cl">
          <div class="title">{{$t('user.essentialInformation')}}</div>
          <div class="save-btn" @click="saveInfo">{{$t('user.save')}}</div>
      </div>
      <div class="profile-content">
          <!-- 用戶名 -->
          <div class="cl">
              <div class="item-title">{{$t('user.accountPhone')}}</div>
              <div class="item-content click-update">
                  <span>{{items.username}}</span>
              </div>
          </div>
          <!-- 名字 -->
          <div class="cl">
              <div class="item-title">{{$t('user.userName')}}</div>
              <div class="item-content click-update">
                  <span v-if="!userNameIsChange" :class="{'gray':!items.name}">{{items.name || $t('null')}}</span>
                  <i v-if="!userNameIsChange" class="update el-icon-edit-outline pointer" @click="clickUpdate('name')"></i>
                  <input v-if="userNameIsChange" id="name-input" v-model="items.name" type="text" @blur="inputBlur('name')" spellcheck="false" maxlength="32">
              </div>
          </div>
          <!-- 郵箱 -->
          <div class="cl">
              <div class="item-title">{{$t('user.email')}}</div>
              <div class="item-content click-update">
                  <span v-if="!emailIsChange" :class="{'gray':!items.email}">{{items.email || $t('null')}}</span>
                  <i v-if="!emailIsChange" class="update el-icon-edit-outline pointer" @click="clickUpdate('email')"></i>
                  <input v-if="emailIsChange" id="email-input" v-model="items.email" type="text" @blur="inputBlur('email')" spellcheck="false">
              </div>
          </div>
          <!-- 推薦碼 -->
          <!-- <div v-if="parseInt(items.vip) > 0" class="cl"> -->
          <div class="cl">
              <div class="item-title">{{$t('user.recommondCode')}}</div>
              <div class="item-content">
                  <span>{{items.recommend_code}}</span>
                  <span id="recommend_code" :data-clipboard-text="shareUrl" @click="shareCode">{{$t('detail.share')}}</span>
              </div>
          </div>
          <!-- 上传头像 -->
          <div class="cl">
              <div class="item-title">{{$t('user.headImage')}}</div>
              <div class="upload item-content">

                <div class="delete pointer" v-if="headImageUrl" @click="deleteUpload"><i class="el-icon-delete"></i></div>
                <el-upload
                    ref="uploadHead"
                    class="avatar-uploader"
                    :action="action"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="handleSelect"
                    :limit="1">
                    <img v-if="headImageUrl" :src="headImageUrl" class="avatar" @load="revokeObjectURL(headImageUrl)">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

              </div>
          </div>
      </div>
      <!-- 联系人信息 -->
      <div class="profile-title cl">
          <div class="title">{{$t('info.contactInfo')}}</div>
      </div>
      <div class="profile-content">
          <div class="cl">
              <div class="item-title">{{$t('user.name')}}</div>
              <div class="item-content click-update">
                  <span v-if="!contactNameIsChange" :class="{'gray':!items.real_name}">{{items.real_name || $t('null')}}</span>
                  <i v-if="!contactNameIsChange" class="update el-icon-edit-outline pointer" @click="clickUpdate('real_name')"></i>
                  <input v-if="contactNameIsChange" id="real_name-input" v-model="items.real_name" type="text" @blur="inputBlur('real_name')" spellcheck="false" maxlength="32">
              </div>
          </div>
          <div class="cl">
              <div class="item-title">{{$t('user.phone')}}</div>
              <div class="item-content click-update">
                  <span v-if="!contactMobileIsChange" :class="{'gray':!items.mobile}">{{items.mobile || $t('null')}}</span>
                  <i v-if="!contactMobileIsChange" class="update el-icon-edit-outline pointer" @click="clickUpdate('mobile')"></i>
                  <input v-if="contactMobileIsChange" id="mobile-input" v-model="items.mobile" type="text" @blur="inputBlur('mobile')" spellcheck="false" maxlength="32">
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import {
  formatDate,
  createObjectURL,
  revokeObjectURL,
  checkIsEmail,
  checkIsEmpty,
  messageTips
} from "../../../assets/js/utils";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      items: new Object(), //获取回来的用户信息
      oldEmail: "",
      oldName : '',
      headImageUrl: "", //头像预览
      userInfo: new Object(), //将要发送的用户信息
      action: `${this.axios.defaults.baseURL}api/web/v1/uploads?lang_id=${this.lang_id}`, //上传文件接口
      userNameIsChange: false,
      emailIsChange: false,
      contactNameIsChange : false,
      contactMobileIsChange : false,
    };
  },
  computed: {
    shareUrl() {
      let pathname = location.pathname.replace('index.html','')
      return `${location.origin}${pathname}#/Sign/SignUp?code=${this.items.recommend_code}`
    }
  },
  methods: {
    revokeObjectURL: revokeObjectURL,
    formatDate: formatDate,
    // 分享推荐码
    shareCode() {
      var clipboard = new Clipboard("#recommend_code");
      clipboard.on("success", e => {
        messageTips(this.$t("successCopy"));
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        messageTips(this.$t("errorText"));
        clipboard.destroy();
      });
    },
    //获取用户信息
    getUserData(data) {
      data = JSON.parse(JSON.stringify(data));
      this.items = data;
      this.oldEmail = data.email;
      this.oldName = data.name;
      this.$set(this.userInfo, "thumb", data.relative_thumb);
    },
    //删除图片
    deleteUpload() {
      this.$refs.uploadHead.clearFiles();
      this.headImageUrl = "";
      this.userInfo.formData = null;
    },
    //选择图片
    handleSelect(file) {
      let raw = file.raw;
      let isType =
        raw.type === "image/jpeg" ||
        raw.type === "image/jpg" ||
        raw.type === "image/png";
      let isLt2M = raw.size / 1024 / 1024 < 2;
      if (!isType) {
        messageTips(this.$t("user.error.imgType"), "error");
      }
      if (!isLt2M) {
        messageTips(this.$t("user.error.imgSize"), "error");
      }
      if (isType == false || isLt2M == false) {
        this.$refs.uploadHead.clearFiles();
      } else {
        this.headImageUrl = createObjectURL(raw);
        this.$set(this.userInfo, "formData", new FormData());
        this.userInfo.formData.append("UploadForm[imageFile][]", raw);
      }
    },
    //上传头像、、上传用户信息
    saveInfo() {
      this.$nextTick(() => {
        if (checkIsEmpty(this.items.name)) {
          messageTips(this.$t("sign.userNameEmptyTips"), "error");
          return false;
        }
      });
      if (this.userInfo.formData) {
          this.axios.post(this.action, this.userInfo.formData).then(res => {
            if (res.data.code != "1000") {
              messageTips(res.data.message, "error");
              return false;
            }
            this.userInfo.thumb = res.data.data.relative_thumb[0];
            this.$set(this.userInfo, "isChange", true);
            this.saveInfoSend.call(this);
          });
        } else {
          this.saveInfoSend();
        }
    },
    //上传用户信息
    saveInfoSend() {
      if (checkIsEmpty(this.items.name)) {
        messageTips(this.$t("sign.userNameEmptyTips"), "error");
        return false;
      }
      if (!this.userInfo.isChange) return false;
      this.axios.patch(`api/web/v1/users?lang_id=${this.lang_id}`, {
          thumb: this.userInfo.thumb,
          name: this.items.name,
          email: this.items.email,
          real_name : this.items.real_name,
          mobile : this.items.mobile,
        }).then(res => {
          if (res.data.code == "1000") {
            messageTips(this.$t("user.saveSuccess"));
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
          } else {
            messageTips(res.data.message, "error");
          }
        });
    },
    //点击更改
    clickUpdate(type) {
      if (type == "name") {
        this.userNameIsChange = true;
      } else if (type == "email") {
        this.emailIsChange = true;
      } else if(type == 'real_name'){
        this.contactNameIsChange = true;
      }else if(type == 'mobile'){
        this.contactMobileIsChange = true;
      }
      this.$nextTick(() => {
        let id = `#${type}-input`;
        let input = document.querySelector(id);
        input.focus();
      });
    },
    //失去焦点
    inputBlur(type) {
      let isChange = false;
      if (type == "name") {
        this.userNameIsChange = false;
      } else if (type == "email") {
        this.emailIsChange = false;
      }else if(type == 'real_name'){
        this.contactNameIsChange = false;
      }else if(type == 'mobile'){
        this.contactMobileIsChange = false;
      }
      let accountIsEmail = checkIsEmail(this.items.email);
      if (!accountIsEmail) {
        messageTips(this.$t("user.error.email"), "error");
        this.items.email = this.oldEmail;
      } else {
        this.oldEmail = this.items.email;
        if (!this.userInfo.isChange) this.$set(this.userInfo, "isChange", true);
      }
      let name = checkIsEmpty(this.items.name);
      if(name){
        messageTips(this.$t("sign.userNameEmptyTips"), "error");
        this.items.name = this.oldName;
      }else{
        this.oldName = this.items.name;
        if (!this.userInfo.isChange) this.$set(this.userInfo, "isChange", true);
      }

    }
  }
};
</script>
<style scoped>
#recommend_code{
  padding: 3px 10px;
  background: #2d9aff;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}
#recommend_code:hover{
  background: #0774da;
}
.pointer {
  cursor: pointer;
}
.profile-title {
  height: 40px;
  line-height: 40px;
}
.profile-title .title {
  float: left;
  color: #000;
  font-size: 18px;
}
.profile-title .save-btn {
  float: right;
  color: #fff;
  background-color: #2d9aff;
  width: 100px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  margin-right: 480px;
  -webkit-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  -moz-transition: all 0.15s;
  transition: all 0.15s;
}
.profile-title .save-btn:hover {
  background-color: #0774da;
}
.profile-content {
  margin-bottom: 40px;
  line-height: 24px;
  padding-top: 40px;
}
.profile-content > div {
  margin-top: 4px;
}
.profile-content > div > div {
  float: left;
}
.profile-content .item-title {
  width: 215px;
  height: 60px;
  text-align: right;
  color: #aaa;
  font-size: 16px;
}
.item-content {
  width: 500px;
  margin-left: 40px;
  color: #000;
  font-size: 16px;
}
.item-content .update {
  color: #2d9aff;
  vertical-align: middle;
  margin-left: 10px;
}
.item-content.click-update input {
  width: 250px;
  outline: 0;
  border: 1px solid #2d9aff;
  border-radius: 4px;
  padding: 2px 4px;
  position: relative;
  left: -3px;
}
/*上传*/
.item-content.upload {
  margin-top: 10px;
  width: 178px;
  height: 178px;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}
.item-content.upload .delete {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  line-height: 178px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: all 0.15s;
}
.item-content.upload:hover .delete {
  opacity: 1;
}
.item-content.upload .delete i {
  color: #fff;
  font-size: 30px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.gray{
  color: #aaa;
}
</style>
