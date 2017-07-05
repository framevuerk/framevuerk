<script>
    export default {
        isFn: true,
        inserted(el, binding, vnode){
            if( binding.value === false ){
                return;
            }
            const data = {
                lastScrollTop: 0,
                lastScrollLeft: 0,
                eventFired: {}
            };
            const emit = (param)=>{
                if( el.__vue__ ){
                    el.__vue__.$emit('fv-scroll', param);
                    el.__vue__.$emit(`fv-scroll-${param}`);
                }
                else{
                    el.dispatchEvent( new Event('fv-scroll'), param );
                    el.dispatchEvent( new Event(`fv-scroll-${param}`) );
                }
            }
            el.addEventListener("scroll", function(event){
                const scrollTop = event.target.scrollTop;
                const scrollLeft = event.target.scrollLeft;
                const lastScrollTop = data.lastScrollTop;
                const lastScrollLeft = data.lastScrollLeft;

                const maxScrollTop = event.target.scrollHeight - event.target.offsetHeight;
                const maxScrollLeft = event.target.scrollWidth - event.target.offsetWidth;

                const topOffset = scrollTop - lastScrollTop;
                const leftOffset = scrollLeft - lastScrollLeft;

                const scrollOffset = 50;

                if( topOffset > 0 ){
                    emit('down');
                    data.eventFired.up = false;
                }
                if( topOffset < 0 ){
                    emit('up');
                    data.eventFired.down = false;
                }
                if( leftOffset > 0 ){
                    emit('right');
                    data.eventFired.left = false;
                }
                if( leftOffset < 0 ){
                    emit('left');
                    data.eventFired.right = false;
                }

                if( scrollTop < scrollOffset && topOffset < 0 ){
                    if( !data.eventFired.up ){
                        emit('end-up');
                        data.eventFired.up = true;
                    }
                }
                if( scrollTop > maxScrollTop - scrollOffset && topOffset > 0 ){
                    if( !data.eventFired.down ){
                        emit('end-down');
                        data.eventFired.down = true;
                    }
                }
                if( scrollLeft < scrollOffset && leftOffset < 0 ){
                    if( !this.eventFired.left ){
                        emit('end-left');
                        data.eventFired.left = true;
                    }
                }
                if( scrollLeft > maxScrollLeft - scrollOffset && leftOffset > 0){
                    if( !this.eventFired.right ){
                        emit('end-right');
                        data.eventFired.right = true;
                    }
                }

                data.lastScrollTop = event.target.scrollTop;
                data.lastScrollLeft = event.target.scrollLeft;
            });
            
        }
    }
</script>