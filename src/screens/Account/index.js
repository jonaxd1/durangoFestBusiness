import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';

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
	accountContainer: {
		alignItems: 'center',
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
});

class Account extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			store: {},
		};
		this.getStore = this.getStore.bind(this)
	}

	componentDidMount() {
		this.getStore();
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

	logout = () => {
		const { navigation } = this.props;
		api.auth.signout()
			.then(() => {
				navigation.navigate('Auth');
			})
			.catch((err) => {
				Toast.show(err.message);
			});
	}

	_keyExtractor = (item, index) => item.createdAt;

	_itemSeparator = () => (
		<View
			style={{
				paddingVertical: 1,
				backgroundColor: '#C3C3C3',
			}}
		/>
	);

	_renderPoints = ({item}) => {
		return (
			<View style={{ 
				flexDirection: 'row', 
				alignItems: 'center',
				paddingVertical: 20,
				justifyContent: 'space-between',
			}}>
				<View>
					<Text style={{fontSize: 18, fontWeight: '500'}}>{item.store}</Text>
					<Text style={{fontSize: 14}}>{new Date(item.createdAt).toLocaleString()}</Text>
				</View>
				<Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.total}</Text>
			</View>
		)
	}
	
	render() {
		const { store } = this.state
		return (
			<SafeAreaView
				style={styles.container}
			>
				<Header
					title="Cuenta"
				/>
                <LinearGradient 
					colors={['#ffebf9','#a31a78','#207ce5']}
					style={{ 
						marginTop: 0,
                        alignItems: 'center',
                        justifyContent: 'space-between',
						padding: 20,
						flex: 1,
				}}>
                    <View style={{ alignItems: 'center'}}>
                        <Icon name="store" size={125} color="#FFF" />
                        <Text style={styles.name}>{store.name}</Text>
                        <Text>{store.description}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={this.logout}
                        style={{
                            backgroundColor:"#d10437",
                            color: '#FFF',
                            paddingVertical: 20,
                            paddingHorizontal: 90,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{ color: '#FFF', marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}
                        >Cerrar Sesión</Text>
                    </TouchableOpacity>
                </LinearGradient>
				{/* 
					<Text
						style={{ fontSize: 16, fontWeight: '300' }}
					>Puntos Disponibles:</Text>
					<Text style={{ fontSize: 28, fontWeight: 'bold' }}>{totalPoints.toString()}</Text>
					<Text style={{ color: '#606060' }}>hasta: 01/12/2019</Text>
					<View style={{ width:'100%', height:1, backgroundColor: '#DCDCDC', marginTop: 15}}/>
					<FlatList
						style={{ width: '100%'}}
						data={historyPoints.reverse()}
						keyExtractor={this._keyExtractor}
						ItemSeparatorComponent={this._itemSeparator}
						renderItem={this._renderPoints}
						onRefresh={() => this.loadUser()}
						refreshing={loading}
					/>
				</LinearGradient> */}
			</SafeAreaView>
		);
	}
}

export default Account;
