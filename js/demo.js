$(function() {
  $('.ck-slide').ckSlide({
      autoPlay:true
      /*dir:"x"*/

  });

  $('#date').datepicker({
   'changeMonth':true,  //月份，年份可以上拉选取
   'changeYear':true,
   'showMonthAfterYear':true,   //把月放在年的后面
   'yearRange':'1950:2020'  //年份选取的区间范围
 });

 $('#reg input[type=radio]').button();   

 $('#reg').dialog({
 	'title':'小米注册',
     'buttons':{
       '提交':function() {
         //alert('正在加载中');
         $(this).submit();   //提交到action="123.html",然而后面有个ajaxSubmit(),就提交到它那了
       },
       '取消':function() {
         $('#reg').dialog('close');
       }
     },
 	'width':340,          //对话框宽高
     'height':340,
    //  'show':'puff',        //缩放出现消失效果
    //  'hide':'puff',
     'modal':true,         //默认false，true会使对话框外有一层灰纱，无法操作
     'autoOpen':false, 
 })
 $('#reg_a').click(function() {       //点击之后显示对话框，并使内容里的文字样式变大
 $('#reg').dialog('open').css('font-size','18px')
})
$('#reg_a').click(function() {        //点击之后出现dialog对话框···
  $('#reg').dialog('open')
})
$('#reg').validate({
  'rules':{
    'user':{
      'required':true,
      'minlength':4,
      'remote':{
        'url':'is_user.php',
        'type':'POST',
      },
    },
    'pass':{
      'required':true,
      'minlength':6,
    },
    'email':{
      'required':true,
      'email':true,
    },
  },
  'messages':{
    'user':{
      'required':'账号不得为空',
      'minlength':'账号长度不得少于{0}位',
      'remote':'账号被占用！'
    },
    'pass':{
      'required':'密码不得为空',
      'minlength':' 密码长度不得少于{0}位',
    },
    'email':{
      'required':'邮箱不得为空',
      'email':'请输入正确的邮箱',
    },
  },

  'highlight':function(element,errorClass) {    //高亮，提交不出去显示有错误的元素，使边框变色
    $(element).css('border','1px solid #630')
    $(element).parent().find('span').html('*').removeClass('succ') //高亮，有错误的元素，它的span的内容为*，移除class为succ
  },
  'unhighlight':function(element,errorClass) {  //不高亮，显示成功的元素,这里的element通过F12可以查到是input
    $(element).css('border','1px solid #CCCCCC')
    //$(element).parent().find('span').html('OK')
    $(element).parent().find('span').html('').addClass('succ')  //成功的元素先清空span里的html文本内容然后
                                                                //给span增加一个class类为succ
  },

  'showErrors':function(errorMap,errorList) {  //获取错误时，提示句柄，不用提交，及时获取值
    var errors = this.numberOfInvalids();
    if(errors > 0) {
      $('#reg').dialog('option','height',errors*30 + 340);
    }
    else{
      $('#reg').dialog('option','height',340);
    }
    this.defaultShowErrors();      //执行默认错误
  },
  'wrapper':'li',  //显示错误信息的外层标签名称
  'errorLabelContainer':'ol.reg-error',  //显示错误信息的容器，根据校验结果隐藏或者显示错误容器

  'submitHandler':function(form) { //submitHandler即当表单通过验证时执行回调函数,在这个回调函数中通过jquery.form来提交表单
    $('form').ajaxSubmit({   //通过ajax提交到数据库
          'url':'add.php',
          'type':'POST',
          'beforeSubmit':function() {
//alert($('#reg').find('button').eq(0).html())在#reg下面找button是没有的,因为#reg，是一个表单(隐藏的表单)。
//$('#reg').dialog()才是对话框,$('#reg').dialog('widget').find('button').eq(0).html()是button的
//内容
            $('#loading').dialog('open');
            $('#reg').dialog('widget').find('button').eq(1).button('disable') //，提交成功前，reg整个对话框的第二个button无法启用
            $('#loading').css('background','url(images/interactive.gif) no-repeat 16px center').html('数据交互中')
          },
          'success':function(responseText,statusText) {
            if(responseText) {    //如果它提交成功，就启用这个按钮
              $('#reg').dialog('widget').find('button').eq(1).button('enable') //这个按钮
              $('#loading').css('background','url(images/currect1.png) no-repeat 20px center').html('数据新增成功!')
              $.cookie('user', $('#user').val())  //提交成功后，生成一个注册时候的cookie
              setTimeout(function() {  //延时函数，应用成功提交完在延迟1秒后消失
                $('#loading').dialog('close');
                $('#reg').dialog('close');
                $('#reg').resetForm();
                $('#reg p span').removeClass('succ').html('*');
                $('#reg_a,#log_a').hide()    //成功提交后执行的是内部的这一块，出现下面3个,起到刷新页面的作用
                $('#number,#logout').show()
                $('#number').html($.cookie('user')) //$('#user').val()不能用它，因为它是当时在文本框上的，现在文本框是空
              },1000)                               //$.cookie('user') 它是用在cookie里储存了，可以一直用的
            }
          },
    })
  },
})


//  登陆············
  $('#log').dialog({
    'title':'用户登陆',
    'buttons':{
      '登陆':function() {
        //alert('正在加载中');
        //alert($('#expires').is(':checked'))    false  //判断#expires是否选择了，给cookie7天过期
        $(this).submit();   //提交到action="123.html"
      },
      '取消':function() {
        $('#log').dialog('close');
      }
    },
    'width':340,          //对话框宽高
    'height':250,
   //  'show':'puff',        //缩放出现消失效果
   //  'hide':'puff',
    'modal':true,         //默认false，true会使对话框外有一层灰纱，无法操作
    'autoOpen':false,        //将对话框初始化，不显示,只有当点击之后才会显示
  });
  $('#log_a').click(function() {       //点击之后显示对话框，并使内容里的文字样式变大
   $('#log').dialog('open').css('font-size','18px')
  })
  $('#log_a').click(function() {        //点击之后出现dialog对话框···
   $('#log').dialog('open')
  })

  $('#log').validate({
  'rules':{
   'log_user':{
     'required':true,
     'minlength':4,
   },
   'log_pass':{
     'required':true,
     'minlength':6,
     'remote':{       //数据验证，用户密码的
       'url':'log.php',
       'type':'POST',
       'data': {       //数据验证，用户user=name的  ,记住data，不要写错！！！！
         'log_user':function() {
           return $('#log_user').val()  //return 表达式; 语句结束函数执行，返回调用函数，而且把表达式的值作为函数的结果
         }
       },
     },
   },
  },
  'messages':{
   'log_user':{
     'required':'账号不得为空',
     'minlength':'账号长度不得少于{0}位',
   },
   'log_pass':{
     'required':'密码不得为空',
     'minlength':' 密码长度不得少于{0}位',
     'remote':'账号或密码不正确',
   },
  },

  'highlight':function(element,errorClass) {    //高亮，提交不出去显示有错误的元素，使边框变色
   $(element).css('border','1px solid #630')
   $(element).parent().find('span').html('*').removeClass('succ') //高亮，有错误的元素，它的span的内容为*，移除class为succ
  },
  'unhighlight':function(element,errorClass) {  //不高亮，显示成功的元素,这里的element通过F12可以查到是input
   $(element).css('border','1px solid #CCCCCC')
   //$(element).parent().find('span').html('OK')
   $(element).parent().find('span').html('').addClass('succ')  //成功的元素先清空span里的html文本内容然后
                                                               //给span增加一个class类为succ
  },

  'showErrors':function(errorMap,errorList) {  //获取错误时，提示句柄，不用提交，及时获取值
   var errors = this.numberOfInvalids();
   if(errors > 0) {
     $('#log').dialog('option','height',errors*30 + 250);
   }
   else{
     $('#log').dialog('option','height',250);
   }
   this.defaultShowErrors();      //执行默认错误
  },
  'wrapper':'li',  //显示错误信息的外层标签名称
  'errorLabelContainer':'ol.log-error',  //显示错误信息的容器，根据校验结果隐藏或者显示错误容器

  'submitHandler':function(form) { //submitHandler即当表单通过验证时执行回调函数,在这个回调函数中通过jquery.form来提交表单
   $('form').ajaxSubmit({   //通过ajax提交到数据库
         'url':'log.php',
         'type':'POST',
         'beforeSubmit':function() {
  //alert($('#reg').find('button').eq(0).html())在#reg下面找button是没有的,因为#reg，是一个表单(隐藏的表单)。
  //$('#reg').dialog()才是对话框,$('#reg').dialog('widget').find('button').eq(0).html()是button的
  //内容
           $('#loading').dialog('open');
           $('#log').dialog('widget').find('button').eq(1).button('disable') //，提交成功前，reg整个对话框的第二个button无法启用
           $('#loading').css('background','url(images/interactive.gif) no-repeat 16px center').html('数据交互中')
         },
         'success':function(responseText,statusText) {
           if(responseText) {    //如果它提交成功，就启用这个按钮
             $('#log').dialog('widget').find('button').eq(1).button('enable') //这个按钮
             $('#loading').css('background','url(images/currect1.png) no-repeat 20px center').html('登陆成功!')
              if ($('#expires').is(':checked')) {          //#expires checked的话，cookie在7天后过期
                $.cookie('user', $('#log_user').val(),{
                  'expires':7,
                })
              } else {
                $.cookie('user', $('#log_user').val())  //提交成功后，生成一个登陆时候的cookie
              }
             setTimeout(function() {  //延时函数，应用成功提交完在延迟1秒后消失
               $('#loading').dialog('close');
               $('#log').dialog('close');
               $('#log').resetForm();
               $('#log p span').removeClass('succ').html('*');
               $('#reg_a,#log_a').hide()    //成功提交后执行的是内部的这一块，出现下面3个,起到刷新页面的作用
               $('#number,#logout').show()
               $('#number').html($.cookie('user')) //$('#log_user').val()不能用它，因为它是当时在文本框上的，现在文本框是空
                    // alert($.cookie('log_user'))
             },1000)                               //$.cookie('log_user') 它是用在cookie里储存了，可以一直用的
           }
         },
   })
  },
})
  
//下拉菜单
$('#read-one').hover(function() {
  $('#read').toggle();
})
$('#read').hover(function() {
  $('#read').toggle();
})

$('#talk-one').hover(function() {
  $('#talk').toggle();
})
$('#talk').hover(function() {
  $('#talk').toggle();
})

//搜索文本框的焦点之战
$('.two-search input[type=text]').focus(function() {
  $('.two-search .mix').css('display','none');
  $('.two-search .TV').css('display','none');
})   //获取焦点时,鼠标点击在文本框内。
$('.two-search input[type=text]').blur(function() {
  if($(this).val()) {
    $('.two-search .mix').css('display','none');
    $('.two-search .TV').css('display','none');
  } else {
   $('.two-search .mix').css('display','block');
   $('.two-search .TV').css('display','block');
  }  //失去焦点时,鼠标点击在文本框外，当文本有值···，否则···
 })
    





})
