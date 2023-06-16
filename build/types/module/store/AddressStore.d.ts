declare class AddressStore {
    rootStore: any;
    contacts: any;
    groups: any;
    chatroom: any;
    searchList: any;
    constructor(rootStore: any);
    setContacts(contacts: any): void;
    setGroups(groups: any): void;
    setChatroom(chatroom: any): void;
    setSearchList(searchList: any): void;
}
export default AddressStore;
