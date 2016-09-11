import xFetch from './xFetch';

export async function getMenus(categoryId,supplierId) {
	return xFetch.post('/api/WaiMaiDingCan/Supplier/GetDishInfoByCategoryId',{categoryId,supplierId});
}

export async function addDish(date) {
	return xFetch.post('/api/shopingcart/adddish',date);
}

export async function deleteDish(date) {
	return xFetch.post('/api/shopingcart/deletedish',date);
}

export async function getCat(date) {
	return xFetch.get('/api/shopingcart/getcart',date);
}

export async function getShopInfo(date) {
	return xFetch.get('/api/supplier/menu',date);
}

export async function clearCat(date) {
	return xFetch.post('/api/shoppingcart/clearcart',date);
}
//获取规格
export async function getDishPackage(supplierdishid) {
	return xFetch.get('/api/supplier/dishpackage',{supplierdishid:supplierdishid});
}