import Reflux      from 'reflux';
import MainActions from './../action/MainActions.jsx';

/**
 * MainStore
 */
const MainStore = Reflux.createStore({
    listenables: MainActions,

    init() {
        this.test = 'World';
    },

    /* -------------
     *    Actions
     * ------------- */

    test() {
        this.trigger();
    },

    /* -------------
     *   Assessors
     * ------------- */

    getComputedState() {
        return {
            test: this.test
        };
    }
});

export default MainStore;
