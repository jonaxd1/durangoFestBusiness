import request from '../utils/request';

function placeOrder(order) {
	return request({
        url: '/orders/place',
        params: order,
		method: 'POST',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

function getOrders(idUser) {
	return request({
		url: '/orders/all',
		params: {idUser: idUser},
		method: 'GET',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

function getSales(idStore) {
	return request({
		url: '/orders/getSales',
		params: {idStore},
		method: 'GET',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

function getSalesByProduct(idStore) {
	return request({
		url: '/orders/getSalesByProduct',
		params: {idStore},
		method: 'GET',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

export default {
	placeOrder,
	getOrders,
	getSales,
	getSalesByProduct,
};
