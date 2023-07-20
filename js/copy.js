document.body.oncopy = function (){
        iziToast.info({
            timeout: 4000, 
            icon: 'Fontawesome', 
            closeOnEscape: 'true', 
            transitionIn: 'bounceInLeft', 
            transitionOut: 'fadeOutRight',
            displayMode: 'replace', 
            layout: '2', 
            position: 'topRight',
            icon: 'fad fa-copy',
            backgroundColor: '#fff', 
            title: '复制成功', 
            message: '转载请先在要转载的文章下留言，等待回复。' 
        });
    }