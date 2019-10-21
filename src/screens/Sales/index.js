import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	ActivityIndicator,
	ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Toast from 'react-native-simple-toast'
import Header from '../../components/Header'
import { BarChart, PieChart } from 'react-native-chart-kit'
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const chartConfig = {
	backgroundColor: '#005ee2',
	backgroundGradientFrom: '#005ee2',
	backgroundGradientTo: '#0d53b8',
	decimalPlaces: 2, // optional, defaults to 2dp
	color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
	style: {
		borderRadius: 16,
		paddingHorizontal: 10
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	containerActivity: {
		flex: 1,
		justifyContent: 'center'
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	}
})
const screenWidth = Dimensions.get('window').width;

class Sales extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			chartData: {
				labels: [0],
				datasets: [{
					data: [0]
				}]
			},
			pieChartData: [],
			loading: true,
		};
		this.getSales = this.getSales.bind(this)
	}

	componentDidMount() {
		this.getStore(() => {
			this.getSales()
			this.getSalesByProduct()
		})
	}

	getStore(callback) {
		AsyncStorage.getItem('user')
			.then((user) => {
				api.stores.getInfo(user)
					.then((store) => {
						this.setState({ store });
					})
					.then(() => {
						callback()
					})
					.catch(() => Alert.alert('Oops!', 'Ocurrio un error inesperado...'))
			})
			.catch(() => Alert.alert('Oops!', 'Ocurrio un error inesperado...'))
	}

	getSales() {
		const { store } = this.state;
		let labelsArray = [];
		let salesArray = [];
		api.orders.getSales(store.idStore)
			.then((res) => {
				res.map((item) => {
					labelsArray.push(item.month)
					salesArray.push(Number(item.sale))
				})
				handleChartData = {
					labels: labelsArray,
					datasets: [{
						data: salesArray
					}]
				}
				this.setState({ chartData: handleChartData });
			})
			.then(() => { this.setState({ loading: false }) })
			.catch((err) => {
				Toast.show('Oops! Ocurrio un error.\nIntenta de nuevo.', Toast.LONG);
			})
	}

	random_rgba() {
		var o = Math.round, r = Math.random, s = 255;
		return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
	}

	getSalesByProduct() {
		const { store } = this.state;
		api.orders.getSalesByProduct(store.idStore)
			.then((res) => {
				let handleChartData = [...res || []]
				handleChartData.map((item) => {
					const color = this.random_rgba();
					item.legendFontColor = '#7F7F7F',
					item.legendFontSize = 15,
					item.color = color,
					item.sales = Number(item.sales)
				})
				this.setState({ pieChartData: handleChartData });
			})
			.then(() => { this.setState({ loading: false }) })
			.catch((err) => {
				Toast.show('Oops! Ocurrio un error.\nIntenta de nuevo.', Toast.LONG);
			})
	}

	render() {
		const { chartData, pieChartData, loading } = this.state;

		if (loading) {
			<View style={[styles.containerActivity, styles.horizontal]}>
				<ActivityIndicator size="large" color="#00ff00" />
			</View>
		}

		return (
			<SafeAreaView
				style={styles.container}
			>
				<Header
					title="Ventas"
				/>
				<ScrollView>
					<Text
						style={{
							marginTop: 10,
							fontWeight: 'bold'
						}}
					>Por mes</Text>
					<BarChart
						height={250}
						yAxisLabel={'$'}
						data={chartData}
						width={screenWidth}
						chartConfig={chartConfig}
						fromZero={true}
					/>
					<Text
						style={{
							marginTop: 10,
							fontWeight: 'bold'
						}}
					>Producto más vendido</Text>
					<PieChart
						data={pieChartData}
						width={screenWidth}
						height={220}
						chartConfig={chartConfig}
						accessor="sales"
						backgroundColor="transparent"
						absolute
					/>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

export default Sales;