Game.Object = {
    oController: function() {
        this.Create = ()=> {
            this.cTimer = 0;
            Game.Instance.Create(new Game.Object[Object.keys(Game.Object)[1]]);
        }

        this.Update = ()=> {
            if (this.cTimer++ % 80 == 0) {
                console.log("made obstacle");
                Game.Instance.Create(new Game.Object.oObstacle, 0, Math.random_range(0, Game.Engine.Target.height));
            }
        }
    },
    oPlayer: function() {
        this.Create = ()=> {
            // Position & Size
            this.cGoto = Game.Engine.Target.width / 12;
            this.cSize = 24;

            // Movement
            this.cAcceleration = 0.15;
            this.cDeceleration = 0.075;
            this.cMaximum = 3;
            this.cMinimum = 0;
            this.cSpeed = 0;

            // Internal
            this.x = (this.cGoto / 2) * -1;
            this.y = Game.Engine.Target.height / 2;
            this.bbox = [-(this.cSize / 2), -(this.cSize / 2), this.cSize / 2, this.cSize / 2];
            console.log(this.bbox);
        }

        this.Update = ()=> {
            // Movement
            this.x = Math.lerp(this.x, this.cGoto, 0.03);
            if (Game.Input.Get(Game.Input.UP) == true) {
                this.cSpeed = Math.max(this.cSpeed - this.cAcceleration, this.cMaximum * -1);
            } else if (Game.Input.Get(Game.Input.DOWN) == true) {
                this.cSpeed = Math.min(this.cSpeed + this.cAcceleration, this.cMaximum);
            } else {
                if (this.cSpeed < 0) {
                    this.cSpeed = Math.min(this.cSpeed + this.cDeceleration, this.cMinimum);
                } else if (this.cSpeed > 0) {
                    this.cSpeed = Math.max(this.cSpeed - this.cDeceleration, this.cMinimum);
                }
            }
            this.y += this.cSpeed;

            // Screen Wrapping
            if (this.y < (this.cSize / 2) * -1) {
                this.y = (Game.Engine.Target.height) + (this.cSize / 2);
            } else if (this.y > (Game.Engine.Target.height) + (this.cSize / 2)) {
                this.y = (this.cSize / 2) * -1;
            }

            // Shooting
            if (Game.Input.GetPressed(Game.Input.SPACE) == true) {
                Game.Instance.Create(new Game.Object.oBullet(), this.x, this.y);
            }
        }

        this.Render = ()=> {
            Game.Graphics.Rectangle(this.x - (this.cSize / 2), this.y - (this.cSize / 2), this.x + (this.cSize / 2), this.y + (this.cSize / 2), false);
        }
    },
    oBullet: function() {
        this.Update = ()=> {
            let fCollision = Game.Collision.Get(Game.Object.oObstacle, this.x, this.y);
            if (fCollision != undefined) {
                Game.Instance.Destroy(this);
            } else if (this.x > Game.Engine.Target.width) {
                Game.Instance.Destroy(this);
            }
            this.x += 4;
        }

        this.Render = ()=> {
            Game.Graphics.Circle(this.x, this.y, 4, false);
        }
    },
    oObstacle: function() {
        this.Create = ()=> {
            this.cSize = Math.irandom_range(32, 64);
            this.bbox = [-(this.cSize / 2), -(this.cSize / 2), this.cSize / 2, this.cSize / 2];
            this.x = Game.Engine.Target.width + (this.cSize / 2);
        }

        this.Update = ()=> {
            this.x -= 2;
            if (this.x < this.cSize * -1) {
                Game.Instance.Destroy(this);
            }
        }

        this.Render = ()=> {
            Game.Graphics.Rectangle(this.x - (this.cSize / 2), this.y - (this.cSize / 2), this.x + (this.cSize / 2), this.y + (this.cSize / 2), false);
        }
    }
}

