$(document).ready(function() {       
      
      	var is_customers = false ;
      
           
      function readMore(string, maxWords) {       
        var strippedString = $("<p>" + string + "</p>").text().trim();      
        var array = strippedString.split(" ");
        var string = array.splice(0, maxWords).join(" ");

        if(array.length > maxWords) {
          string += "...";
        }

        return string ;
      }
     
      function convert_currency(value,type){
          var shopCurrency = $("span[data-shop-currency]").attr("data-shop-currency");
          try{
            var newCurrency = Currency.currentCurrency;
          }catch(ex){
            var newCurrency = '';
          }
          try{
            var oldCurrency = shopCurrency;
          }catch(ex){
            var oldCurrency = '';
          }
          if(isNaN(value)){
            value =  0.0; 
          }
         
          var cents = 0.0;
          var oldFormat = Currency.moneyFormats['EUR'][ Currency.format] || '';
                                                var newFormat = Currency.moneyFormats[newCurrency][Currency.format] || '';

                                                if(type == 'format'){
                                                  return  Currency.formatMoney(value, newFormat);
                                                }
          if (oldFormat.indexOf('amount_no_decimals') !== -1) {
            cents = Currency.convert(parseInt(value, 10)*100, oldCurrency, newCurrency);
          }
          else if (oldCurrency === 'JOD' || oldCurrency == 'KWD' || oldCurrency == 'BHD') {
            cents = Currency.convert(parseInt(value, 10)/10, oldCurrency, newCurrency);
          }
          else { 
            cents = Currency.convert(parseInt(value, 10), oldCurrency, newCurrency);
          }
          if(type  == 'nosymbol'){
            return cents;
          }
          var my_data =  Currency.formatMoney(cents, newFormat);
          return my_data;       
      }
      function get_symbol(value){
          var str = value.split("");
          var sym = '';
          for(var i=0;i<str.length;i++){
            if(isNaN(str[i])){
                sym+=str[i];
            }else{
              return sym; 
            }
          }
          return sym;
      }
      function get_price_only(price){
        var price_convert= price.toString();
        var get_currencies = 0;
        var $split = price_convert.split(';');
            if($split.length > 1){
              get_currencies = (isNaN(parseInt( price_convert.substring(1,0)))) ?  $split[1]:  $split[0];
              get_currencies = get_currencies.replace(/[^0-9.]/g, '');
            }else{
              get_currencies =price_convert.replace(/[^0-9.]/g, '');
            }
            
            get_currencies = $.trim(get_currencies); 
            var check = get_currencies.substring(1,0);
            if(isNaN((check))){
              get_currencies =   get_currencies.replace(check,'');
            }            
        return parseFloat(get_currencies);

      }
     
      var min_price 		= $("#min_price").val()*100;
      var max_price 		= $("#max_price").val()*100;
      var max_price_slide 	= convert_currency(max_price,'');
      var get_currencies 	= convert_currency(max_price,'');
      var min_price_slide	= convert_currency(min_price,'');
      var limit_product 	= $("#limitProductPage").val();
	  var $split 			= get_currencies.split(';');

      
      if($split.length > 1){
        get_currencies = (isNaN(parseFloat( get_currencies.substring(1,0)))) ?  $split[0]+';':  $split[1]+';';

      }else{
        get_currencies = (isNaN(parseFloat( get_currencies.substring(1,0)))) ? get_symbol( get_currencies):   get_currencies.substring(1,-1);
      }
   
  function loadMoreProduct(paramLimit, paramTotal){
    var size_pr = parseInt(paramTotal);
    var x = parseInt(paramLimit);
    var number = parseInt(paramLimit);
    var index = 0;
    jQuery(document).ajaxComplete(function( event, xhr, settings ) {      
      if(xhr.responseText.indexOf("ajax-pr")!= -1){
        index++;
      }
      console.log(index);
      console.log(paramTotal);
      if(index == paramTotal){
        if (paramTotal >paramLimit ){
        var loadMoreHTML = "";
        loadMoreHTML	=	loadMoreHTML + "<div id='loadMore' class='bn_button viewall text-center' style=''>";
        loadMoreHTML	=	loadMoreHTML + "<a href='javascript:void(0);'>Cargar Más</a>";
        loadMoreHTML	=	loadMoreHTML + "</div>";
        $(".bot_page_collection").empty();
        $(".bot_page_collection").append(loadMoreHTML);
        $(".bot_page_collection").show();
        }
        $('.js_wrap_loadMore .product-item:lt('+x+')').show();
        $('#loadMore').click(function () {          
          x = (x + number <= size_pr) ? x + number : size_pr;
          
          $('.js_wrap_loadMore .product-item:lt('+x+')').show();      
          if(x == size_pr){
            $('#loadMore').hide();
          }
        });
      }
    })	    
  }
  function initFilterPrice(){
    $('div[data-range-price]').slider({
      range: true,
      min: get_price_only(min_price_slide),
      max: get_price_only(max_price_slide),
      values: [get_price_only(min_price_slide), get_price_only(max_price_slide)],
      slide: function(event, ui) {
        var max_price_slide = convert_currency(max_price,'');
        var get_currencies = convert_currency(max_price,'');
        var min_price_slide = convert_currency(min_price,'');              

        var $split = get_currencies.split(';');
        if($split.length > 1){
          get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ?  $split[0]+';':  $split[1]+';';

        }else{
          get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ? get_symbol( get_currencies):   get_currencies.substring(1,-1);
        }
        var max_pr = get_currencies + '' + parseFloat(ui.values[1]).toFixed(2);
        var min_pr =  get_currencies +'' + parseFloat(ui.values[0]).toFixed(2);	

        $("div[data-amount-price] [data-from]").html(min_pr);
        $("div[data-amount-price] [data-to]").html(max_pr);
      },
      change: function(event, ui) {
        jQuery("body").addClass('ajax_loading'); /* Hiển thị loading khi filter ajax*/
	    $("div[data-top-content-filter]").removeClass("opened");
        var vMaxPrice = ui.values[1]; /* Đọc max price từ thanh cuộn */
        var vMinPrice = ui.values[0];  /* Đọc min price từ thanh cuộn */

        var vIndex = 0; /* Biến lưu chỉ số duyệt sản phẩm */
        var vSumProduct   = 0; /* Biển lưu tổng số sản phẩm */
        var vPage = 1; /* Biển lưu tổng số trang khi phân trang */
        var vCount = 0; /* Biến đếm các sản phẩm thoả mãn điều kiện */              

        var vHtml = ''; /* Khởi tạo biến html = rỗng để chuẩn bị cho việc append các sản phẩm vào khu vực kết quả */
        var vView = $(".js_cat_view.active").data('col') > 0 ? 'grid' : 'list' ; /* Lấy view từ collection view có trạng thái active với data-col = 0 là list*/
        var vcol = $("#productPerPage").val(); /* Lấy số lượng column */
        var vHasProduct = false; /* Biến kiểm tra có sản phẩm thoả mãn điều kiện */
			
        $("#collection-product").empty(); /* Xoá các item trên khung kết quả */
        $("div[data-container-cat]").addClass("js_product_ajax"); /* Thêm class để điều khiển phân trang */
        $(".products-result-count").empty(); /* Xoá biến hiển thị số kết quả phân trang */
        $(".js_paginate_ajax").empty(); /* Xoá dữ liệu phần tử hiển thị kết quả phân trang */
        
        if($('.js_cat_view.active').length <= 0){/* Nếu không tồn tại collection view thì gán view = grid */
          vView = 'grid';
        }

        /*Duyệt các sản phẩm từ mảng danh sách collection thông qua json_collection_filter (biến này được truyền từ sections/collection.liquid ) */
        $.each(json_collection_filter,function(paramIndex, paramElement) {
          var current_price =  convert_currency(paramElement.variants[0].price,'');  /* Lấy giá hiện thời của từng sản phẩm */                	
          current_price = get_price_only(current_price); /* Chỉ lấy số của giá */                 	
          if (current_price <= vMaxPrice && current_price >= vMinPrice) {  /* Kiểm tra giá sản phẩm có thoả mãn điệu kiện lọc */
            vHasProduct = true; /* Có sản phẩm thoả mãn điều kiện*/  
            var xhr = null;
            var handle_collection = $("#currency_collection_handle").val();
            var url_cat = "/collections/"+handle_collection;            
            var pr_hd = paramElement.handle;
            $(".bot_page_collection").hide();
            xhr = $.ajax({
                    type: 'GET',
                    url: url_cat+'/products/'+pr_hd,
                    cache: false,
                    data: {
                        view: 'ajax-product'
                    },
                    dataType: 'html',
                    success: function (data) { 
                      $("#collection-product").addClass("js_wrap_loadMore");
                      $("#collection-product").append(data);
                      
                      /* Re-init review and tooltip */                     
                        SPR.registerCallbacks();
                        SPR.initRatingHandler();
                        SPR.initDomEls();
                        SPR.loadProducts();
                        SPR.loadBadges();
                    
                      setTimeout(function(){ 
                        tippy('.product-item .js_add_to_cart_button, .product-item .js-compare, .product-item .js-wishlist, .product-item .js_quick_view,.product-item-style2.small .js_add_to_cart_button, .product-item-style2 .js-compare, .product-item-style2 .js-wishlist, .product-item-style2 .js_quick_view', {
                          placement: 'top',
                          animation: 'perspective',
                          arrow: true
                        })
                      },500)
                    }
            })
            //vHtml = vHtml + json_to_html(paramElement,vView,paramIndex,vPage, vcol);  /* Gọi hàm để tạo giao diện html cho sản phẩm rồi thêm vào biến vHtml */
            vSumProduct++; /* Tăng biến tổng sản phẩm khi tìm thấy sản phẩm thoả mãn điều kiện */                     
            vCount++; /*Tăng biến đếm*/
            vIndex++; /* Tăng chỉ số duyệt sản phẩm trong mảng sản phẩm */
          }else{
            $("div[data-top-content-filter]").removeClass("opened");
          }                           
          
        });        
       
        
        
        if(! vHasProduct){ /* Nếu duyệt hết mảng sản phẩm mà không tìm được sản phẩm thoả mãn điều kiện */
          vHtml +='<div class="shopify-info no-products"><i class="flash fa fa-exclamation-triangle" aria-hidden="true"></i>No hay productos que coincidan con su precio</div>';
        }          
        $("#collection-product").append(vHtml);  /* Append giao diện kết quả sản phẩm vào khu vực kết quả lọc */     
        
        loadMoreProduct(limit_product, vIndex);
		
        
        if($('.shopify-product-reviews-badge').length > 0){/*Reinit lại app product review */
          SPR.registerCallbacks();
          SPR.initRatingHandler();
          SPR.initDomEls();
          SPR.loadProducts();
          SPR.loadBadges();
        }
        
        setTimeout(function(){ 
          tippy('div[data-js-tooltip], a[data-js-tooltip]', {
            placement: 'top',
            animation: 'perspective',
            arrow: true
          })
        }, 500)
       
        window.setTimeout(function() {
          jQuery("body").removeClass('ajax_loading'); /* Sau khi đã hiển thị kết quả lọc thì đóng loading */
        }, 1000);

      } 

    }); 

  }
      initFilterPrice(); /* Khởi tạo hàm lọc với price */
  
      $(document).on('shopify:section:load', function(){    /* Khi section được load trong admin */
        initFilterPrice(); /* Gọi lại hàm lọi với price*/
      })
      
      /*jQuery(document).on('pjax:end', function (xhr, textStatus, options) { 
        
        $('div[data-range-price]').slider({
          range: true,
          min: 0,
          max: get_price_only(max_price_slide),
          values: [get_price_only(min_price_slide), get_price_only(max_price_slide)],
          slide: function(event, ui) {
            var max_price_slide = convert_currency(max_price,'');
            var get_currencies = convert_currency(max_price,'');
            var min_price_slide = convert_currency(min_price,'');              

            var $split = get_currencies.split(';');
            if($split.length > 1){
              get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ?  $split[0]+';':  $split[1]+';';

            }else{
              get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ? get_symbol( get_currencies):   get_currencies.substring(1,-1);
            }
            var max_pr = get_currencies + '' + parseFloat(ui.values[1]).toFixed(2);
            var min_pr =  get_currencies +'' + parseFloat(ui.values[0]).toFixed(2);	

            $("div[data-amount-price] [data-from]").html(min_pr);
            $("div[data-amount-price] [data-to]").html(max_pr);
          }
        })
      })*/
  })

