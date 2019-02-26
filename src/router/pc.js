import Index from '../pages/pc/index';
import Detail from '../pages/pc/detail';
import Buy from '../pages/pc/buy';
import Evaluate from '../pages/pc/evaluate';
import Forgot from '../pages/pc/forgot';
import Message from '../pages/pc/message';
import MessageDetail from '../pages/pc/messageDetail';
import OrderDetail from '../pages/pc/orderDetail';
import PreviewDetail from '../pages/pc/previewDetail';
import Qa from '../pages/pc/qa';
import QaDetail from '../pages/pc/qaDetail';
import Search from '../pages/pc/search';
import Trip from '../pages/pc/trip';
import Sign from '../pages/pc/sign/sign';
import SignIn from '../pages/pc/sign/signIn';
import SignUp from '../pages/pc/sign/signUp';
import User from '../pages/pc/user/user';
import Profile from '../pages/pc/user/profile';
import PassportDetail from '../pages/pc/user/passportDetail';
import Collection from '../pages/pc/user/collection';
import pointsRebate from '../pages/pc/user/pointsRebate';
import Strategy from '../pages/pc/user/strategy';
import Vip from '../pages/pc/user/vip';
import AboutUs from '../pages/pc/user/aboutUs';

const PCPage = [
    {
        path: '/',
        name : 'Index',
        component: Index,
    },
    {
        path: 'Detail',
        name : 'Detail',
        component: Detail,
    },
    {
        path: 'Buy',
        name : 'Buy',
        component: Buy,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'Evaluate',
        name : 'Evaluate',
        component: Evaluate,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'Message',
        name : 'Message',
        component: Message,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'MessageDetail',
        name : 'MessageDetail',
        component: MessageDetail,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'PreviewDetail',
        name : 'PreviewDetail',
        component: PreviewDetail,
    },
    {
        path: 'OrderDetail',
        name : 'OrderDetail',
        component: OrderDetail,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'Trip',
        name : 'Trip',
        component: Trip,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'Forgot',
        name : 'Forgot',
        component: Forgot,
    },
    {
        path: 'Qa',
        name : 'Qa',
        component: Qa,
    },
    {
        path: 'QaDetail',
        name : 'QaDetail',
        component: QaDetail,
    },
    {
        path: 'Search',
        name : 'Search',
        component: Search,
    },
    {
        path: 'User',
        name : 'User',
        component: User,
        children:[
            {
                path: '/',
                name : 'Profile',
                component: Profile,
                meta: {
                    requireAuth : true
                }
            },
            {
                path: 'PassportDetail',
                name : 'PassportDetail',
                component: PassportDetail,
                meta: {
                    requireAuth : true
                }
            },
            {
                path: 'Collection',
                name : 'Collection',
                component: Collection,
                meta: {
                    requireAuth : true
                }
            },
            {
                path: 'pointsRebate',
                name : 'pointsRebate',
                component: pointsRebate,
                meta: {
                    requireAuth : true
                }
            },
            {
                path: 'Strategy',
                name : 'Strategy',
                component: Strategy,
                meta: {
                    requireAuth : true
                }
            },
            {
                path: 'Vip',
                name : 'Vip',
                component: Vip,
                meta: {
                    requireAuth : true
                }
            },
            {
                path: 'AboutUs',
                name : 'AboutUs',
                component: AboutUs,
                meta: {
                    requireAuth : true
                }
            },
        ]
    },
    {
        path: 'Sign',
        name : 'Sign',
        component: Sign,
        children:[
            {
                path: '/',
                name : 'SignIn',
                component: SignIn,
            },
            {
                path: 'SignUp',
                name : 'SignUp',
                component: SignUp,
            },
        ]
    },
]
export default PCPage;