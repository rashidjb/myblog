import { extendObservable } from "mobx";
import { ListView} from 'react-native';

class myStore {
    constructor() {
        extendObservable(this, {
            pageTitle: 'Welcome to the (unofficial) GitHub App',
            authenticated: false,
            username: '',
            token: '',
            counter: 1,
            slug: "",
            postDetails: {},
            posts: {
                dataFetched: false,
                dataSource: new ListView.DataSource({rowHasChanged:(row1, row2) => row1 != row2,}),
                initialFetch: true,
                detailsURL: '',
                nextUrl: '',
                previousUrl: '',
                pageNumber: 1,
                totalPages: 1,
                count: 0,
                limit: 0,
                count: 0,
            },
            newPost: false,
            })
    }
}

export default new myStore()
