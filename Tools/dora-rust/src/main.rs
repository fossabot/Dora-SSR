#[macro_use] pub mod dora;

use crate::dora::{Object, Node, INode, Director, CallInfo, Value, Array};

fn main() {
	dora::init();
	println!("Hello, world!");
	let mut node = Node::new();
	println!("id: {}", node.get_id());
	println!("x: {}", node.get_x());
	node.set_x(100.5);
	node.set_tag("电风扇");
	println!("x: {}, tag: {}", node.get_position().x, node.get_tag());
	let mut i = 0;
	node.schedule(Box::new(move |dt| {
		i = i + 1;
		println!("{} {}", i, dt);
		i > 30
	}));
	node.slot("Enter", Box::new(|_| {
		println!("Entered!");
	}));
	node.slot("Event", Box::new(|args| {
		println!("MyEvent! {}, {}, {}", args.pop_i32().unwrap(), args.pop_str().unwrap(), args.pop_bool().unwrap());
	}));

	let mut entry = Director::get_entry();
	entry.add_child(&node);

	node.emit("Event", &args!(1, "dsd", true));

	let mut arr = Array::new();
	arr.set(0, node.obj());
	if let Some(a) = arr.get(0).unwrap().into_object().unwrap().as_any_mut().downcast_mut::<Node>() {
		a.emit("name", &args!(1, 2, 3));
		entry.add_child(a);
	}
}