/*
    链表模块LinkedList.js
*/
function LinkedList() {
    function Node(data){
        this.data = data;
        this.next = null;
        this.previous = null;
    }
    this.head = null;
    this.tail = null;
    this.length = 0;

    LinkedList.prototype.append = function (data) {
        let newNode = new Node(data);
        if (this.length == 0) {
            this.head = newNode;
            this.tail = newNode;
            this.length += 1;
        }else{
            this.tail.next = newNode;
            newNode.previous = this.tail;
            this.tail = newNode;
            this.length += 1;
        }
    }

    LinkedList.prototype.insert = function (position,data) {
        position = parseInt(position)
        let preNode = null;
        let nextNode = this.head;
        let newNode = new Node(data);
        if (position < 0 || position > this.length) {
            console.log("不正确的插入位置：" + position + "；链表总长度：" + this.length)
            return false;
        }else{
            if (position == 0) {
                newNode.next = this.head;
                newNode.next.previous = newNode;
                this.head = newNode;
                this.length += 1;
            }else if (position == this.length) {
                this.append(data);
            }else{
                for (let i = 0; i < position; i++) {
                    nextNode = nextNode.next;
                    preNode = nextNode.previous;
                }
                preNode.next = newNode;
                nextNode.previous = newNode;
                newNode.previous = preNode;
                newNode.next = nextNode;
                this.length += 1;
            }
        }
    }

    LinkedList.prototype.get = function (position) {
        position = parseInt(position)
        let nowNode = this.head;
        if (position < 0 || position >= this.length) {
            console.log("不正确的查找位置：" + position + "；链表总长度：" + this.length)
            return false;
        }else{
            for (let i = 0; i < position; i++) {
                nowNode = nowNode.next;
            }
            return nowNode.data;
        }
    }

    LinkedList.prototype.indexOf = function (data) {
        let nowNode = this.head;
        let found = 0;
        let index = 0;
        for (let i = 0; i < this.length; i++) {
            if (nowNode.data == data) {
                found = 1;
                index = i;
                break;
            }
            nowNode = nowNode.next;
        }
        if (found === 0) {
            console.log("链表中未找到该元素")
            return false
        }else{
            return index;
        }
    }

    LinkedList.prototype.update = function (position,data){
        position = parseInt(position)
        let nowNode = this.head;
        if (position < 0 || position >= this.length) {
            console.log("不正确的更新位置：" + position + "；链表总长度：" + this.length)
            return false;
        }else{
            for (let i = 0; i < position; i++) {
                nowNode = nowNode.next;
            }
            nowNode.data = data;
        }
    }

    LinkedList.prototype.removeAt = function (position) {
        position = parseInt(position)
        let nowNode = this.head;
        if (position < 0 || position >= this.length) {
            console.log("不正确的删除位置：" + position + "；链表总长度：" + this.length)
            return false;
        }else{
            if (position == 0) {
                this.head = nowNode.next;
                this.length -= 1;
            }else if (position == this.length - 1) {
                nowNode = this.tail;
                this.tail = nowNode.previous;
                this.length -= 1;
            }else{
                for (let i = 0; i < position; i++) {
                    nowNode = nowNode.next;
                }
                nowNode.next.previous = nowNode.previous;
                nowNode.previous.next = nowNode.next;
                this.length -= 1;
            }
        }
    }

    LinkedList.prototype.remove = function (data) {
        let index = this.indexOf(data);
        this.removeAt(index);
    }

    LinkedList.prototype.isEmpty = function () {
        if (this.length) {
            return false;
        } else {
            return true;
        }
    }

    LinkedList.prototype.size = function () {
        return this.length;
    }

    LinkedList.prototype.toList = function () {
        let list = [];
        let nowNode = this.head;
        for (let i = 0; i < this.length; i++) {
            nowNode.data.ID = i
            list.push(nowNode.data);
            nowNode = nowNode.next;
        }
        return list;
    }

    LinkedList.prototype.goUp = function (position) {
        position = parseInt(position)
        if (position < 1 || position >= this.length) {
            console.log("不正确的移动位置：" + position + "；链表总长度：" + this.length)
        }else{
            let nowData = this.get(position)
            let upData = this.get(position - 1)
            this.update(position, upData)
            this.update(position-1, nowData)
        }
    }

    LinkedList.prototype.goDown = function (position) {
        position = parseInt(position)
        if (position < 0 || position >= this.length - 1) {
            console.log("不正确的移动位置：" + position + "；链表总长度：" + this.length)
        }else{
            let nowData = this.get(position)
            let downData = this.get(position + 1)
            this.update(position, downData)
            this.update(position+1, nowData)
        }
    }

    LinkedList.prototype.copy = function (position) {
        position = parseInt(position)
        if (position < 0 || position >= this.length) {
            console.log("不正确的复制位置：" + position + "；链表总长度：" + this.length)
        }else{
            let nowData = this.get(position)
            this.insert(position + 1,nowData)
        }
    }
}

export default LinkedList;