import React, { Component, PropTypes } from 'react';
import { ListenerMixin }               from 'reflux';
import reactMixin                      from 'react-mixin';
import MainStore                       from './../store/MainStore.jsx';

/**
 * HelloWorld
 */
class HelloWorld extends Component {
    constructor(props) {
        super(props);

        this.state = MainStore.getComputedState();
    }

    /**
     * Bind the component to the main Store
     */
    componentDidMount() {
        this.listenTo(MainStore, this.updateState);
    }

    /**
     * Update Component state after store updated
     */
    updateState() {
        this.setState(MainStore.getComputedState());
    }

    /**
     * @return {XML}
     */
    render() {
        let { test }  = this.state;
        let { title } = this.props;

        return (
            <div>
                <h1>{`${title} ${test}`}</h1>
            </div>
        );
    }
}

reactMixin(HelloWorld.prototype, ListenerMixin);

HelloWorld.propTypes = {
    title: PropTypes.string.isRequired
}

export default HelloWorld;
