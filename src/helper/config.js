import {getConfig as getConfigApi} from "@/service/api";

export default class ConfigClass {
	config = null
	static async getConfig () {
		if(this.config){
			return  this.config
		}
		this.config = getConfigApi().catch((e) => {
			throw e;
		});
		this.config = await this.config
		sessionStorage.setItem('config',JSON.stringify(this.config))
		return this.config;
	}
}