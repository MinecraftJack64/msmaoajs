class Popup {//WIP
    //creating a popup
    constructor({
        title = "LISTEN UP!",
        description = null,
        components = [],
        type = "notice",
        actions = null,
        height = null
    } = {}) {
        this.title = title
        if (description) {
            components.unshift(new TextComponent(description))
        } else {
        }
        this.components = components
        if (type == "selector") {
            this.actions = actions
        } else if (type == "none") {
            this.actions = []
        } else if (type == "notice") {
            this.actions = [new Button({ type: 'ok' })]
        } else if (type == "confirmation") {
            this.actions = [new Button({ type: 'ok' }), new Button({ type: 'close' })]
        }
        this.maxheight = height
    }
}

class Button {
    isactive = false
    location = {
        x: 0,
        y: 0
    }
    constructor({ type = 'square/ok', callback = null } = {}) {
        this.type = type
        this.callback = callback
        this.isactive = false
        this.clickhitbox = "rect"//WIP, can be "rect" or "circle"
        if(this.clickhitbox == "rect"){
            this.hitbox = {
                x: -10,
                y: -10,
                width: 10,
                height: 10
            }
        }else{
            this.hitbox = {
                x: 0,
                y: 0,
                radius: 0
            }
        }
    }
    activate() {
        if(!this.isactive){
            Input.addClickListener(this)
            this.isactive = true
        }
    }
    deactivate() {
        if(isactive){
            Input.removeClickListener(this)
            this.isactive = false
        }
    }
    click(){
        if(this.callback){
            this.callback()
        }
    }
    applyaction(action){
        if(action == "click"){
            this.state = "click"
        }else if(action == "mousemove"){
            this.state = "hover"
        }else if(action == "unclick"){
            this.state = "normal"
            this.click();
        }else if(action == "mouseout"){
            this.state = "normal"
        }
    }
    notify(action, x, y){
        //check if the click is within the button's hitbox
        x-=this.location.x
        y-=this.location.y
        if(this.clickhitbox == "rect"){
            if(x >= this.hitbox.x && x <= this.hitbox.x + this.hitbox.width && y >= this.hitbox.y && y <= this.hitbox.y + this.hitbox.height){
                this.applyaction(action)
            }else{
                this.applyaction("mouseout")
            }
        }else{
            if(Math.sqrt((x - this.hitbox.x) ** 2 + (y - this.hitbox.y) ** 2) <= this.hitbox.radius){
                this.applyaction(action)
            }else{
                this.applyaction("mouseout")
            }
        }
    }
}