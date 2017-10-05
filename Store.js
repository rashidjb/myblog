import { extendObservable } from "mobx";
import { ListView} from 'react-native';

class myStore {
    constructor() {
        extendObservable(this, {
            pageTitle: 'Welcome to the (unofficial) GitHub App',
            authenticated: false,
            username: '',
            token: '',
            pressed: false,
            dataFetched: false,
            dataSource: new ListView.DataSource({rowHasChanged:(row1, row2) => row1 != row2,}),
            newPost: false,
            })
    }
}

export default new myStore()
