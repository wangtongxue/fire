import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/page/login'
import index from '@/components/page/index'
import forgetPass from '@/components/page/forgetPass'
// 这个组件是首页
import home from '@/components/page/home'
//下边组件是系统设置
import unitManagement from '@/components/system/unitManagement'
// 这里是单位管理下的添加和编辑路由组件
import addDanwei from '@/components/system/unitManagement/addDanwei'
import editorDanwei from '@/components/system/unitManagement/editorDanwei'

import accountManagement from '@/components/system/accountManagement'
import unitSetting from '@/components/system/unitSetting'
import enterpriseLogo from '@/components/system/enterpriseLogo'
import authorityManagement from '@/components/system/authorityManagement'
import systemMessage from '@/components/system/systemMessage'
import businessBill from '@/components/system/businessBill'
// 这是单位选择组件
import areaPage from '@/components/area/areaPage'
// 这是单位选择下的三大块 组件
import jiankong from '@/components/area/areaThree/jiankong'
import guanli from '@/components/area/areaThree/guanli'
import fenxi from '@/components/area/areaThree/fenxi'
//这里是监控下的5大组件
import huozai from '@/components/area/areaJiankong/huozai'
import dianqi from '@/components/area/areaJiankong/dianqi'
import NB from '@/components/area/areaJiankong/NB'
import outroom from '@/components/area/areaJiankong/outroom'
import video1 from '@/components/area/areaJiankong/video1'
// 这里是区域选择下的实时监控下的火灾 下的 6个组件
import yongchuan from '@/components/area/areaJiankong/huozaiCom/yongchuan'
import sheshi from '@/components/area/areaJiankong/huozaiCom/sheshi'
import bujian from '@/components/area/areaJiankong/huozaiCom/bujian'
import baojingguzhang from '@/components/area/areaJiankong/huozaiCom/baojingguzhang'
import shebeifenbu from '@/components/area/areaJiankong/huozaiCom/shebeifenbu'
import shipin from '@/components/area/areaJiankong/huozaiCom/shipin'
import yuanshidata from '@/components/area/areaJiankong/huozaiCom/yuanshidata'
// 这里是设备管理下的5个组件
import guanli_huozai from '@/components/area/areaGuanli/guanli_huozai'
import guanli_dianqi from '@/components/area/areaGuanli/guanli_dianqi'
import guanli_NB from '@/components/area/areaGuanli/guanli_NB'
import guanli_outroom from '@/components/area/areaGuanli/guanli_outroom'
import guanli_video from '@/components/area/areaGuanli/guanli_video'
// 这里是设备分析下的五个组件
import fenxi_huozai from '@/components/area/areaFenxi/fenxi_huozai'
import fenxi_dianqi from '@/components/area/areaFenxi/fenxi_dianqi'
import fenxi_NB from '@/components/area/areaFenxi/fenxi_NB'
import fenxi_outroom from '@/components/area/areaFenxi/fenxi_outroom'
import fenxi_video from '@/components/area/areaFenxi/fenxi_video'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/forgetpass',
      name: 'forgetPass',
      component: forgetPass
    },
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
        mustLogin: true
      },
      children: [
        {
          path: '/',
          name: 'home',
          component: home,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/area/areaLink',
          name: 'areaPage',
          component: areaPage,
          redirect: '/area/areaLink/jiankong',
          meta: {
            mustLogin: true
          },
          children: [
            {
              path: 'jiankong',
              name: 'jiankong',
              component: jiankong,
              redirect: '/area/areaLink/jiankong/huozai',
              meta: {
                mustLogin: true
              },
              children: [
                {
                  path: 'huozai',
                  name: 'huozai',
                  component: huozai,
                  redirect: '/area/areaLink/jiankong/huozai/sheshi',
                  meta: {
                    mustLogin: true
                  },
                  children: [
                    {
                      path: 'yongchuan',
                      name: 'yongchuan',
                      component: yongchuan,
                      meta: {
                        mustLogin: true
                      }
                    },
                    {
                      path: 'sheshi',
                      name: 'sheshi',
                      component: sheshi,
                      meta: {
                        mustLogin: true
                      }
                    },
                    {
                      path: 'bujian',
                      name: 'bujian',
                      component: bujian,
                      meta: {
                        mustLogin: true
                      }
                    },
                    {
                      path: 'baojingguzhang',
                      name: 'baojingguzhang',
                      component: baojingguzhang,
                      meta: {
                        mustLogin: true
                      }
                    },
                    {
                      path: 'shebeifenbu',
                      name: 'shebeifenbu',
                      component: shebeifenbu,
                      meta: {
                        mustLogin: true
                      }
                    },
                    {
                      path: 'shipin',
                      name: 'shipin',
                      component: shipin,
                      meta: {
                        mustLogin: true
                      }
                    },
                    {
                      path: 'yuanshidata',
                      name: 'yuanshidata',
                      component: yuanshidata,
                      meta: {
                        mustLogin: true
                      }
                    }
                  ]
                },
                {
                  path: 'dianqi',
                  name: 'dianqi',
                  component: dianqi,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'NB',
                  name: 'NB',
                  component: NB,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'outroom',
                  name: 'outroom',
                  component: outroom,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'video1',
                  name: 'video1',
                  component: video1,
                  meta: {
                    mustLogin: true
                  }
                }
              ]
            },
            {
              path: 'guanli',
              name: 'guanli',
              component: guanli,
              redirect: '/area/areaLink/guanli/guanli_huozai',
              meta: {
                mustLogin: true
              },
              children: [
                {
                  path: 'guanli_huozai',
                  name: 'guanli_huozai',
                  component: guanli_huozai,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'guanli_dianqi',
                  name: 'guanli_dianqi',
                  component: guanli_dianqi,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'guanli_NB',
                  name: 'guanli_NB',
                  component: guanli_NB,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'guanli_outroom',
                  name: 'guanli_outroom',
                  component: guanli_outroom,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'guanli_video',
                  name: 'guanli_video',
                  component: guanli_video,
                  meta: {
                    mustLogin: true
                  }
                }
              ]
            },
            {
              path: 'fenxi',
              name: 'fenxi',
              component: fenxi,
              redirect: '/area/areaLink/fenxi/fenxi_huozai',
              meta: {
                mustLogin: true
              },
              children: [
                {
                  path: 'fenxi_huozai',
                  name: 'fenxi_huozai',
                  component: fenxi_huozai,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'fenxi_dianqi',
                  name: 'fenxi_dianqi',
                  component: fenxi_dianqi,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'fenxi_NB',
                  name: 'fenxi_NB',
                  component: fenxi_NB,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'fenxi_outroom',
                  name: 'fenxi_outroom',
                  component: fenxi_outroom,
                  meta: {
                    mustLogin: true
                  }
                },
                {
                  path: 'fenxi_video',
                  name: 'fenxi_video',
                  component: fenxi_video,
                  meta: {
                    mustLogin: true
                  }
                }
              ]
            }
          ]
        },
        {
          path: '/system/unitManagement',
          name: 'unitManagement',
          component: unitManagement,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/unitManagement/addDanwei',
          name: 'addDanwei',
          component: addDanwei,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/unitManagement/editorDanwei',
          name: 'editorDanwei',
          component: editorDanwei,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/accountManagement',
          name: 'accountManagement',
          component: accountManagement,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/unitSetting',
          name: 'unitSetting',
          component: unitSetting,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/businessBill',
          name: 'businessBill',
          component: businessBill,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/enterpriseLogo',
          name: 'enterpriseLogo',
          component: enterpriseLogo,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/authorityManagement',
          name: 'authorityManagement',
          component: authorityManagement,
          meta: {
            mustLogin: true
          }
        },
        {
          path: '/system/systemMessage',
          name: 'systemMessage',
          component: systemMessage,
          meta: {
            mustLogin: true
          }
        }
      ]
    }
  ]
})
// 引入cookie函数
import cookiesFn from '../utils/cookies'

router.beforeEach((to, from, next) => {
  if(to.matched.some((item) => item.meta.mustLogin)){
    // console.log('登录才能访问')
    // console.log(sessionStorage.getItem('wtx_user'))
    if(cookiesFn.getCookie('UserInfo')){ // 已经登录
      if(to.path == '/system/unitManagement/addDanwei' && JSON.parse(cookiesFn.getCookie('UserInfo')).Permission == 3){
        next({path: '/system/unitManagement'})
      }else {
        next()
      }
    }else{
      next({path: '/login'})
    }
  }else if(cookiesFn.getCookie('UserInfo')){
    // console.log('已经登录，不能进登录、找回密码页面')
    next({ path: from.path })
  }else{
    next()
  }
})
export default router
