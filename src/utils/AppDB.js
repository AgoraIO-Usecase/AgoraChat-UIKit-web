import Dexie from 'dexie'
import _ from 'lodash'

const DB_VERSION = '1'
const TABLE_NAME = 'IM_message'
const TABLE_INDEX_KEYS = ['id', 'from', 'to', 'chatType', 'isUnread', 'status', 'mid', 'session']
const DB_ENABLE = true
const PAGE_NUM = 20
const AppDB = {
	// init db
	init: function (username) {
		if (this.db) {
			return;
		}
		// create a database, use username as db name
		const db = (this.db = new Dexie(username));

		// create a table, use TABLE_NAME as table name
		db.version(DB_VERSION).stores({
			[TABLE_NAME]: TABLE_INDEX_KEYS.join(","),
		});
		this.$_TABLE = db.table(TABLE_NAME);
	},

	exec(cb1, cb2) {
		return new Promise(function (resolve, reject) {
			if (DB_ENABLE) {
				cb1(resolve);
			} else {
				cb2 && cb2(reject);
			}
		});
	},

	// get unread messages
	getUnreadList() {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("isUnread")
				.equals(1)
				.toArray()
				.then((res) => resolve(res));
		});
	},

	// get lastest mumber of message by start index
	fetchMessage(
		userId,
		chatType = "singleChat",
		offset = 0,
		limit = PAGE_NUM
	) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("chatType")
				.equals(chatType)
				.filter((item) => {
					if (item.error) {
						return false;
					}
					if (chatType === "singleChat") {
						return item.from === userId || item.to === userId;
					} else {
						return item.to === userId;
					}
				})
				.reverse()
				.offset(offset)
				.limit(limit)
				.sortBy("time")
				.then((res) => {
					resolve(res.reverse());
				});
		});
	},

	// read all messages of conversation
	readMessage(chatType, userId) {
		const $_TABLE = this.$_TABLE;
		const key = chatType === "singleChat" ? "from" : "to";
		return this.exec((resolve) => {
			$_TABLE
				.where({ chatType: chatType, [key]: userId, isUnread: 1 })
				.modify({ isUnread: 0 })
				.then((res) => {
					resolve(res);
				});
		});
	},

	// update message status
	updateMessageStatus(id, status) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("id")
				.equals(id)
				.modify({ status: status })
				.then((res) => {
					resolve(res);
				});
		});
	},

	deleteMessage(id) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("id")
				.equals(id)
				.delete()
				.then((res) => resolve(res));
		});
	},

	updateMessageMid(mid, id) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("id")
				.equals(id)
				.modify({ mid: mid })
				.then((res) => console.log("res", res));
		});
	},

	updateMessageUrl(id, url) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			console.log(
				">>>>>msgUrl>>>",
				$_TABLE.where("id").equals(id).modify({ url: url })
			);
			$_TABLE
				.where("id")
				.equals(id)
				.modify({ url: url })
				.then((res) => console.log("res", res));
		});
	},

	// add a message to the database
	addMessage(message, isUnread = 0) {
		const $_TABLE = this.$_TABLE;
		if ($_TABLE === undefined) return;
		if (!message.error) {
			return this.exec((resolve) => {
				$_TABLE
					.where("id")
					.equals(message.id)
					.count()
					.then((res) => {
						if (res === 0) {
							message.isUnread = isUnread;
							$_TABLE
								.add(message)
								.then((res) => resolve(res))
								.catch((e) => console.log("add messaga:", e));
						}
					});
			});
		}
	},

	// clear all messages of specified conversation
	clearMessage(chatType, id) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("chatType")
				.equals(chatType)
				.filter((item) => {
					if (chatType === "chat") {
						return item.from === id || item.to === id;
					} else {
						return item.to === id;
					}
				})
				.delete()
				.then((res) => resolve(res));
		});
	},

	deleteSession(chatType, id) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("chatType")
				.equals(chatType)
				.where("session")
				.equals(id)
				.delete()
				.then((res) => resolve(res));
		});
	},

	getSessionList(chatType, id) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			$_TABLE
				.where("id")
				.above(-1)
				.sortBy("time")
				.then((res) => {
					let sessionList = [];
					let sessionObj = {};
					res.forEach((element) => {
						if (
							element.chatType === "singleChat" &&
							!sessionObj[element.session]
						) {
							sessionObj[element.session] = true;
							sessionList.push({
								sessionId: element.session,
								sessionType: element.chatType,
							});
						} else if (!sessionObj[element.to]) {
							sessionObj[element.to] = true;
							sessionList.push({
								sessionId: element.to,
								sessionType: element.chatType,
							});
						}
					});
					// let _sessionList =  _.uniqBy(sessionList,'sessionId')
					resolve(sessionList);
				});
		});
	},

	updateMessageReaction(id, reactions) {
		const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
            const $_TABLE = this.$_TABLE;
			return this.exec((resolve) => {
				$_TABLE
					.where("id")
					.equals(id)
					.modify({ reactions: reactions })
					.then((res) => {
						console.log("updateMessageReaction", res);
					});
			});
		});
	},

    deleteReactions(id,meta) {
        const $_TABLE = this.$_TABLE;
		return this.exec((resolve) => {
			const $_TABLE = this.$_TABLE;
			return this.exec((resolve) => {
				$_TABLE
					.where("id")
					.equals(id)
					.modify({ meta: meta })
					.then((res) => {
						console.log("deleteReactions", res);
					});
			});
		});
    }
};

export default AppDB

