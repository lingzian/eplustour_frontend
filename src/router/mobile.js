import Index from '../pages/mobile/index';
import Detail from '../pages/mobile/detail';
import User from '../pages/mobile/user';
import RecommendSearch from '../pages/mobile/recommendSearch';
import Search from '../pages/mobile/search';
import AboutUs from '../pages/mobile/aboutUs';
import Buy from '../pages/mobile/buy';
import ChooseTraveler from '../pages/mobile/ChooseTraveler';
import CheckOut from '../pages/mobile/checkOut';
import Evaluate from '../pages/mobile/evaluate';
import Forgot from '../pages/mobile/forgot';
import Hot from '../pages/mobile/hot';
import Info from '../pages/mobile/info';
import Language from '../pages/mobile/language';
import Message from '../pages/mobile/message';
import MessageList from '../pages/mobile/messageList';
import MessageDetail from '../pages/mobile/messageDetail';
import OrderDetail from '../pages/mobile/orderDetail';
import TravelerList from '../pages/mobile/travelerList';
import TravelerInfo from '../pages/mobile/travelerInfo';
import Qa from '../pages/mobile/qa';
import QaDetail from '../pages/mobile/qaDetail';
import Strategy from '../pages/mobile/strategy';
import Trip from '../pages/mobile/trip';
import Collection from '../pages/mobile/collection';
import PointsRebate from '../pages/mobile/pointsRebate';
import Profile from '../pages/mobile/profile';
import Sign from '../pages/mobile/sign/sign';
import SignIn from '../pages/mobile/sign/signIn';
import SignUp from '../pages/mobile/sign/signUp';
import PaymentCallback from '../pages/mobile/paymentCallback';
import MobilePayment from '../pages/mobile/mobilePayment';


const MobilePage = [
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
        path: 'User',
        name : 'User',
        component: User,
    },
    {
        path: 'RecommendSearch',
        name : 'RecommendSearch',
        component: RecommendSearch,
    },
    {
        path: 'Search',
        name : 'Search',
        component: Search,
    },
    {
        path: 'AboutUs',
        name : 'AboutUs',
        component: AboutUs,
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
        path: 'ChooseTraveler',
        name : 'ChooseTraveler',
        component: ChooseTraveler,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'CheckOut',
        name : 'CheckOut',
        component: CheckOut,
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
        path: 'Forgot',
        name : 'Forgot',
        component: Forgot,
    },
    {
        path: 'Hot',
        name : 'Hot',
        component: Hot,
    },
    {
        path: 'Info',
        name : 'Info',
        component: Info,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'Language',
        name : 'Language',
        component: Language,
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
        path: 'MessageList',
        name : 'MessageList',
        component: MessageList,
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
        path: 'OrderDetail',
        name : 'OrderDetail',
        component: OrderDetail,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'TravelerList',
        name : 'TravelerList',
        component: TravelerList,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'TravelerInfo',
        name : 'TravelerInfo',
        component: TravelerInfo,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'PaymentCallback',
        name : 'PaymentCallback',
        component: PaymentCallback,
    },
    {
        path: 'MobilePayment',
        name : 'MobilePayment',
        component: MobilePayment,
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
        path: 'Strategy',
        name : 'Strategy',
        component: Strategy,
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
        path: 'Collection',
        name : 'Collection',
        component: Collection,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'PointsRebate',
        name : 'PointsRebate',
        component: PointsRebate,
        meta: {
            requireAuth : true
        }
    },
    {
        path: 'Profile',
        name : 'Profile',
        component: Profile,
        meta: {
            requireAuth : true
        }
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
export default MobilePage;