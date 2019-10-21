import request from '../utils/request';

function create(params) {
	return request({
        url: '/products',
        params: params,
		method: 'POST',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

function getAll(idStore) {
	return request({
        url: '/products',
        params: { where: {idStore: idStore}},
		method: 'GET',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

function getInfo(idProduct) {
	return request({
		url: '/products/getInfo',
		params: { 'idProduct': idProduct },
		method: 'GET',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

function update(params) {
	const { idProduct, ...props } = params;
	return request({
		url: `/products/${idProduct}`,
		data: props,
		method: 'PUT',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

export default {
	create,
	getAll,
	getInfo,
	update,
};
