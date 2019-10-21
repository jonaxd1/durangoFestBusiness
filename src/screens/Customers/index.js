import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Header from '../../components/Header';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	title: {
		fontSize: 34,
		fontWeight: 'bold',
		marginBottom: 10,
	},
});

class Customers extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			store: {},
			loading: false,
			refreshing: false,
		};
		this.loadCustomers = this.loadCustomers.bind(this)
		this.gotoOrders = this.gotoOrders.bind(this)
	}

	componentDidMount() {
		this.getStore();
		// this.loadCustomers();
	}

    getStore() {
		AsyncStorage.getItem('user')
			.then((user) => {
				api.stores.getInfo(user)
					.then((store) => {
                        this.setState({store});
						return api.orders.getAllCustomers(store.idStore)
					})
					.then((customers) => {
						this.setState({ customers });
					})
					.catch((err) => Toast.show(err.message, Toast.LONG))
			})
			.catch((err) => Toast.show(err.message, Toast.LONG))
    }
    
	loadCustomers() {
        this.setState({loading: true});
        
		api.orders.getAllCustomers(this.state.store.idStore)
			.then((customers) => {
				this.setState({customers});
			})
			.catch((err) => {
				Toast.show(err, Toast.LONG);
			})
			.finally(() => {
				setTimeout(() => {
					this.setState({loading: false})
				},1000)
			});
    }
    
    gotoOrders(idCustomer){
        const { store } = this.state;
        this.props.navigation.navigate('Orders', {store, idCustomer});
    }

	_keyExtractor = (item, index) => String(item.idCustomer);

	_itemSeparator = () => (
		<View
			style={{
				paddingVertical: 1,
				marginLeft: 70,
				backgroundColor: '#C3C3C3',
			}}
		/>
	);

	_renderCustomers = ({item}) => {
		return (
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					paddingVertical: 20,
					paddingHorizontal: 23,
					justifyContent: 'space-between',
                }}
                onPress={() => this.gotoOrders(item.idCustomer)}
			>
				<View
					style={{
						flexDirection: 'row',
					}}
				>
					<Icon name="history" size={40}/>
					<View
						style={{
							paddingLeft: 10,
						}}
					>
                        <Text style={{}}>Cliente:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{item.customer ? item.customer : 'Null'}</Text>
					</View>
				</View>
				<Text
					style={{
						fontSize: 19,
						fontWeight: 'bold',
						color: '#518E54'
					}}
				>{item.points ? item.points : 0} puntos</Text>
			</TouchableOpacity>
		)
	}

	render() {
        const { customers, loading } = this.state;
        
		return (
			<SafeAreaView
				style={styles.container}
			>
				<Header
					title="Clientes"
				/>
				<FlatList
					data={customers}
					renderItem={this._renderCustomers}
					keyExtractor={this._keyExtractor}
					ItemSeparatorComponent={this._itemSeparator}
					onRefresh={() => this.loadCustomers()}
					refreshing={loading}

				/>
			</SafeAreaView>
		);
	}
}

export default Customers;
