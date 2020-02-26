import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Layout from './components/layout'
import ApplicationNavigator from './navigation/containers'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/lib/integration/react'

export default class App extends Component {

    componentDidMount() {}

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Layout>
                        <ApplicationNavigator />
                    </Layout>
                </PersistGate>
            </Provider>
        )
    }
}
