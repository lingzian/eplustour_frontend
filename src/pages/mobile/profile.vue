<template>
    <div>
        <div v-if="items.username != undefined" class="mb-padding-content">
            <ul class="content">
                <li class="head cl">
                    <div>{{$t('user.head')}}</div>
                    <div>
                        <label for="file-picker">
                            <head-image class="file_picker_image" :thumb="fileUpload.isSelect ? imgUrl : items.thumb"></head-image>
                            <i class="el-icon-arrow-right"></i>
                        </label>
                    </div>
                </li>
                <li class="account cl">
                    <div>{{$t('user.accountPhone')}}</div>
                    <div>{{items.username}}</div>
                </li>
                <li class="recommond cl">
                    <div>{{$t('user.recommondCode')}}</div>
                    <div class="view">
                        <span>{{items.recommend_code}}</span>
                        <span id="recommend_code" :data-clipboard-text="shareUrl" @click="shareCode">{{$t('detail.share')}}</span>
                    </div>
                </li>
                <li class="name cl">
                    <div class="primary_star">{{$t('user.userName')}}</div>
                    <div :class="{'gray' : !name}" @click="changeSet('name',$t('user.userName'),name)">{{name || $t('null')}}<i class="el-icon-arrow-right"></i></div>
                </li>
                <li class="email cl">
                    <div class="primary_star">{{$t('user.email')}}</div>
                    <div :class="{'gray' : !email}" @click="changeSet('email',$t('user.email'),email)">{{email || $t('null')}}<i class="el-icon-arrow-right"></i></div>
                </li>
                <li class="contact cl">
                  <div>{{$t('user.contactType')}}</div>
                </li>
                <li class="contact_name cl">
                  <div>{{$t('user.name')}}</div>
                  <div :class="{'gray' : !userName}" @click="changeSet('userName',$t('user.name'),userName)">{{userName || $t('null')}}<i class="el-icon-arrow-right"></i></div>
                </li>
                <li class="contact_phone cl">
                  <div>{{$t('user.phone')}}</div>
                  <div :class="{'gray' : !userPhone}" @click="changeSet('userPhone',$t('user.phone'),userPhone)">{{userPhone || $t('null')}}<i class="el-icon-arrow-right"></i></div>
                </li>
                <li class="travelers cl" @click="$router.push({path:'/TravelerList'})">
                  <div>{{$t('user.travelerManagement')}}</div>
                  <div><i class="el-icon-arrow-right"></i></div>
                </li>
            </ul>
            <div class="btn" @click="submit">{{$t('user.save')}}</div>
            <div class="exit">
                <span @click="toastShow = true">{{$t('head.exit')}}</span>
            </div>
        </div>
        <input type="file" id="file-picker" @change="selectImage" :accept="fileUpload.type.join(',')">
        <transition name="fade">
            <div v-if="toastShow" class="exitToast" @click="toastShow = false">
                <div class="exitToast_btn" @click.stop>
                    <div class="exitTips">{{$t('head.exitTips')}}</div>
                    <div class="sureBtn" @click="exit">{{$t('head.exitting')}}</div>
                    <div class="cancelBtn" @click="toastShow = false">{{$t('head.cancel')}}</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import {
  afterExit,
  checkIsEmail,
  checkIsEmpty,
  createObjectURL,
  revokeObjectURL,
  messageTips
} from "../../assets/js/utils";
import { MessageBox } from "mint-ui";
import Clipboard from "clipboard";
import headImage from "../../components/common/headImage";
export default {
  components: {
    headImage
  },
  data() {
    return {
      items: new Object(),
      name: "",
      email: "",
      firstShowUrl : '',
      imgUrl: "", //上傳圖片生成的圖片路徑base64
      isChange: false, //用來判斷是否改動了用戶信息
      fileUpload: {
        isSelect: false,
        type: ["image/jpeg", "image/jpg", "image/png"],
        maxSize: 2 * 1024 * 1024,
        formData: new Object(),
        url: "" //提交的url
      },
      isRequest: false, //是否正在请求，提交防抖
      toastShow: false, //退出登陸彈出層
      userName : '',
      userPhone : '',
    };
  },
  created() {
    this.getUserInfo();
  },
  computed: {
    shareUrl() {
      let pathname = location.pathname.replace('index.html','')
      return `${location.origin}${pathname}#/Sign/SignUp?code=${this.items.recommend_code}`
    }
  },
  methods: {
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
    //提交
    submit() {
      //验证是否为空
      if(checkIsEmpty(this.name)){
        messageTips(this.$t("sign.userNameEmptyTips"));
        return false;
      }
      if(checkIsEmpty(this.email)){
        messageTips(this.$t("sign.email"));
        return false;
      }
      //验证是否为邮箱
      if (!checkIsEmail(this.email)) {
        messageTips(this.$t("user.error.email"));
        return false;
      }
      if (this.isRequest) return false;
      this.isRequest = true;
      if (this.fileUpload.isSelect) {
        this.axios
          .post(
            `api/web/v1/uploads?lang_id=${this.lang_id}`,
            this.fileUpload.formData
          )
          .then(res => {
            if (res.data.code != "1000") {
              messageTips(res.data.message);
              this.isChange = false;
              return false;
            }
            this.fileUpload.url = res.data.data.relative_thumb[0];
            this.isChange = true;
            this.sendUserInfo.call(this);
          });
      } else {
        this.sendUserInfo();
      }
    },
    //发送更改用户信息请求
    sendUserInfo() {
      if (!this.isChange) return false;
      this.axios
        .patch(`api/web/v1/users?lang_id=${this.lang_id}`, {
          thumb: this.fileUpload.url,
          name: this.name,
          email: this.email,
          real_name : this.userName,
          mobile : this.userPhone,
        })
        .then(res => {
          if (res.data.code == "1000") {
            messageTips(this.$t("user.saveSuccess"));
          } else {
            messageTips(res.data.message);
          }
          this.isRequest = false;
        });
    },
    //选择图片
    selectImage() {
      var inp = document.querySelector("#file-picker");
      var file = inp.files[0];
      inp.value = "";
      if (!file) return false;
      if (this.fileUpload.type.indexOf(file.type) == -1) {
        messageTips(this.$t("user.error.imgType"));
        return false;
      }
      if (file.size > this.fileUpload.maxSize) {
        messageTips(this.$t("user.error.imgSize"));
        return false;
      }
      if (this.fileUpload.isSelect) revokeObjectURL(this.imgUrl);
      this.fileUpload.isSelect = true;
      var url = createObjectURL(file);
      this.imgUrl = url;
      this.fileUpload.formData = new FormData();
      this.fileUpload.formData.append("UploadForm[imageFile][]", file);
    },
    //改变名字或者邮箱
    changeSet(inp, title, value) {
      MessageBox.prompt(title, {
        confirmButtonText: this.$t("head.sure"),
        cancelButtonText: this.$t("head.cancel"),
        closeOnClickModal: false,
        inputValue: value
      })
        .then(res => {
          if (inp == "name" && res.value.length > 32) {
            messageTips(this.$t("sign.tips.nameLength"));
            return false;
          }
          if (this[inp] != res.value) this.isChange = true;
          this[inp] = res.value;
        })
        .catch(res => {
          //nothing to do
        });
    },
    //退出登陆
    exit() {
      this.axios
        .post(`/api/web/v1/users/logout?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code == 1000) {
            messageTips(this.$t("head.exitSuccess"));
            afterExit(this);
          } else {
            messageTips(res.data.message);
          }
          this.toastShow = false;
        });
    },
    //請求用戶信息
    getUserInfo() {
      this.axios
        .get(`api/web/v1/users/profile?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code == "1000") {
            this.items = Object.freeze(res.data.data);
            this.name = this.items.name;
            this.email = this.items.email;
            this.fileUpload.url = this.items.relative_thumb;
            this.userName = this.items.real_name;
            this.userPhone = this.items.mobile;
          } else {
            messageTips(res.data.message);
          }
        });
    },
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
  },
};
</script>

<style scoped>
.mb-padding-content {
  padding-bottom: 0;
}
.content li {
  background-color: #fff;
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.373333rem;
  padding: 0 0.4rem;
}
.content li i {
  font-size: 0.4rem;
  vertical-align: middle;
  margin-left: 0.2rem;
  color: #aaa;
}
.content li > div:first-of-type {
  float: left;
}
.content li > div:nth-of-type(2) {
  float: right;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 5rem;
}
.content li.recommond > div:nth-of-type(2) > span:first-of-type {
  padding-right: 0.14rem;
}
.content li.recommond > div:nth-of-type(2) > span:last-of-type {
  background-color: #2d9aff;
  color: #fff;
  padding: 0.04rem 0.2rem;
  border-radius: 0.18rem;
}
.content li.head,
.content li.name,
.content li.contact_name,
.content li.account {
  border-bottom: 0.026667rem solid #eee;
}
.content li.recommond,
.content li.contact_phone,
.content li.travelers{
  margin-bottom: 0.36rem;
}
.content li.contact{
  background-color: transparent;
}
.btn {
  width: 80%;
  background-color: #2d9aff;
  color: #fff;
  text-align: center;
  margin: 0 auto;
  padding: 0.266667rem 0;
  border-radius: 0.4rem;
  font-size: 0.373333rem;
}
.exit {
  text-align: center;
  margin-top: 0.533333rem;
}
.exit span {
  border-bottom: 0.026667rem solid #2d9aff;
  color: #2d9aff;
  font-size: 0.373333rem;
}
.content li.head {
  line-height: 1.8rem;
  height: 1.8rem;
}
.content li.head > div:nth-of-type(2) {
  height: 1.8rem;
}
.file_picker_image,
.content li.head > div:nth-of-type(2) img {
  width: 1.066667rem;
  height: 1.066667rem;
  border-radius: 50%;
}
.file_picker_image{
  display: inline-block;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
#file-picker {
  display: none;
}
/*退出登陸彈出層 */
.exitToast {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
}
.exitToast_btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.exitToast .exitToast_btn > div {
  background-color: #fff;
  text-align: center;
  font-size: 0.4rem;
  margin-top: 0.4rem;
  height: 1.2rem;
  line-height: 1.2rem;
  padding: 0 0.2rem;
}
.exitToast .exitToast_btn > div:first-of-type {
  line-height: normal;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  height: auto;
}
.exitToast .exitToast_btn > div.sureBtn {
  color: #2d9aff;
  margin-top: 0;
  border-top: 0.04rem solid #ccc;
}
.exitToast .exitToast_btn > div.exitTips {
  color: orange;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.gray{
  color: #ccc;
}
.primary_star{
  position: relative;
}
.primary_star::before{
  content: "*";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-120%,-41%);
  color: #f00;
  font-size:.5rem;
}
</style>
