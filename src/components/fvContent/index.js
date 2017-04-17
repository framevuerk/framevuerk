import template from './template.pug'

export default ({
    template: template,
    props: {
        scrollEvents: {
            type: Boolean,
            default: false
        }
    },
    data: function(){
        return {
            lastScrollTop: 0,
            lastScrollLeft: 0,
            eventFired: {}
        }
    },
    methods: {
        onScroll: function(event){
            const scrollTop = event.target.scrollTop;
            const scrollLeft = event.target.scrollLeft;
            const lastScrollTop = this.lastScrollTop;
            const lastScrollLeft = this.lastScrollLeft;

            const maxScrollTop = event.target.scrollHeight - event.target.offsetHeight;
            const maxScrollLeft = event.target.scrollWidth - event.target.offsetWidth;

            const topOffset = scrollTop - lastScrollTop;
            const leftOffset = scrollLeft - lastScrollLeft;

            const scrollOffset = 20;

            if( topOffset > 0 ){
                this.$emit('scroll-down');
                this.eventFired.up = false;
            }
            if( topOffset < 0 ){
                this.$emit('scroll-up');
                this.eventFired.down = false;
            }
            if( leftOffset > 0 ){
                this.$emit('scroll-right');
                this.eventFired.left = false;
            }
            if( leftOffset < 0 ){
                this.$emit('scroll-left');
                this.eventFired.right = false;
            }

            if( scrollTop < scrollOffset && topOffset < 0 ){
                if( !this.eventFired.up || this.eventFired.up === false ){
                    this.$emit('scroll-end-up');
                    this.eventFired.up = true;
                }
            }
            if( scrollTop > maxScrollTop - scrollOffset && topOffset > 0 ){
                if( !this.eventFired.down || this.eventFired.down === false ){
                    this.$emit('scroll-end-down');
                    this.eventFired.down = true;
                }
            }
            if( scrollLeft < scrollOffset && leftOffset < 0 ){
                if( !this.eventFired.left || this.eventFired.left === false ){
                    this.$emit('scroll-end-left');
                    this.eventFired.left = true;
                }
            }
            if( scrollLeft > maxScrollLeft - scrollOffset && leftOffset > 0){
                if( !this.eventFired.right || this.eventFired.right === false ){
                    this.$emit('scroll-end-right');
                    this.eventFired.right = true;
                }
            }

            this.lastScrollTop = event.target.scrollTop;
            this.lastScrollLeft = event.target.scrollLeft;
        },
        startScrollEvents: function(start=true){
            this.$el[start? 'addEventListener': 'removeEventListener']("scroll", this.onScroll);
        }
    },
    mounted: function(){
        if( this.scrollEvents ){
            this.startScrollEvents();
        }
    },
    destroyed: function(){
        this.startScrollEvents( false );
    },
    watch: {
        scrollEvents: function(){
            this.startScrollEvents(this.scrollEvents);
        }
    }
})