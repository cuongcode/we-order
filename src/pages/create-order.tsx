import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { Order, User, Menu } from "@/types";
import Router from "next/router";

const CreateOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  // const [user, setUser] = useState<User>({
  //   id: "",
  //   name: "",
  //   momo: "",
  //   menus: [],
  // });
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu>({
    id: "",
    name: "",
    link: "",
  });

  useEffect(() => {
    _fetchOrders();
    _fetchMenus();
  }, []);

  const _fetchOrders = async () => {
    const query = collection(db, "orders");
    onSnapshot(query, (snapshot) => {
      const updatedOrders = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setOrders(updatedOrders);
    });
  };

  const _fetchMenus = async () => {
    onSnapshot(collection(db, "menus"), (snapshot) => {
      const updatedMenus = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setMenus(updatedMenus);
    });
  };

  const _createOrder = async () => {
    // if (user.name != '' && user.momo != '' && selectedMenu.link != '') {
    //   const newOrder = {
    //     shipFee: 0,
    //     discount: 0,
    //     shopOwnerName: '',
    //     shopOwnerMomo: '',
    //     selectedMenuName: '',
    //     selectedMenuLink: '',
    //   };
    const newOrder = {
          shipFee: 0,
          discount: 0,
          shopOwnerName: '',
          shopOwnerMomo: '',
          selectedMenuName: '',
          selectedMenuLink: '',
        }
      await addDoc(collection(db, "orders"), newOrder);
  };

  return (
    <div className="flex flex-col gap-4 w-96 bg-green-100">
      <Link href="/">Landing Page</Link>
      <div>Anonymous</div>
      {/* <AnonymousUser user={user} setUser={setUser} /> */}
      <div>Menu:</div>
      <AddMenu />
      <MenuList menus={menus} setSelectedMenu={setSelectedMenu}/>
      <div className="flex flex-col">
        <div>Selected Menu</div>
        <div>{selectedMenu.name}</div>
      </div>
      <button type="button" onClick={_createOrder}>
        Create Order
      </button>
      <OrderList orders={orders} />
    </div>
  );
};

export default CreateOrderPage;

const AnonymousUser = ({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) => {
  const _onNameChange = (e: any) => {
    const updatedUser = { ...user, name: e.target.value };
    setUser(updatedUser);
  };

  const _onMomoChange = (e: any) => {
    const updatedUser = { ...user, momo: e.target.value };
    setUser(updatedUser);
  };

  return (
    <div className="flex flex-col">
      <div>Name</div>
      <input
        className="border-2"
        type="text"
        value={user.name}
        onChange={(e) => _onNameChange(e)}
      />
      <div>Momo</div>
      <input
        className="border-2"
        type="string"
        value={user.momo}
        onChange={(e) => _onMomoChange(e)}
      />
    </div>
  );
};

const OrderList = ({ orders }: { orders: Order[] }) => {
  const _openOrder = (id: string | null) => {
    Router.push(`/order/${id}`);
  };
  return (
    <div className="flex flex-col">
      {orders.map((order: Order) => (
        <button
          type="button"
          key={order.id}
          onClick={() => _openOrder(order.id)}
        >
          {order.id}
        </button>
      ))}
    </div>
  );
};

const AddMenu = () => {
  const [menu, setMenu] = useState<Menu>({ id: "", name: "", link: "" });

  const _onNameChange = (e: any) => {
    const updatedMenu = { ...menu, name: e.target.value };
    setMenu(updatedMenu);
  };

  const _onLinkChange = (e: any) => {
    const updatedMenu = { ...menu, link: e.target.value };
    setMenu(updatedMenu);
  };

  const _addMenu = async () => {
    if (menu.name != "" && menu.link != "") {
      await addDoc(collection(db, "menus"), {
        name: menu.name,
        link: menu.link,
      });
      setMenu({ id: "", name: "", link: "" });
    }
    return;
  };

  return (
    <div className="flex flex-col">
      <div>Name :</div>
      <input
        className="border-2"
        type="text"
        value={menu.name}
        onChange={(e) => _onNameChange(e)}
      />
      <div>Link :</div>
      <input
        className="border-2"
        type="text"
        value={menu.link}
        onChange={(e) => _onLinkChange(e)}
      />
      <button type="submit" onClick={_addMenu}>
        Add Menu
      </button>
    </div>
  );
};

const MenuList = ({
  menus,
  setSelectedMenu,
}: {
  menus: Menu[];
  setSelectedMenu: (menu: Menu) => void;
}) => {
  return (
    <div className="flex flex-col">
      {menus.map((menu: Menu) => (
        <button
          type="button"
          key={menu.id}
          onClick={() => setSelectedMenu(menu)}
        >
          {menu.name}
          {menu.link}
        </button>
      ))}
    </div>
  );
};
