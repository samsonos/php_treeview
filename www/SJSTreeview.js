/**
 * SamsonJS Treeview plugin
 */
var SamsonJSTreeview =
{
    treeview : function(asyncRendering, asyncCompleteHandler)
    {
        var useAsyncRendering = asyncRendering !== undefined ? asyncRendering : false;
        var completeHandler = asyncCompleteHandler !== undefined ? asyncCompleteHandler : false;
        // Указатель на самого себя
        var _self = this;

        // Если есть элементы DOM в выборке
        if ( _self.length )
        {
            // Добавим CSS стиль для дерева
            s( 'ul', _self ).addClass('sjs-treeview');

            // Установим всем веткам дерева специальный класс
            s( 'li', _self ).addClass('notlast');

            // Установим специальный класс для последней ветки дерева на 0-м уровне
            s( 'li:last-child', _self ).removeClass('notlast').addClass('last');

            // Переберем все элементы в данном списке
            s('li',_self).each(function(li)
            {
                // Получим подчиненные ветки для данного элемента списка
                // и если такие имеются то установим специальный стиль
                // указываабщий на то что ветка может "сворачиваться"
                if( s( 'ul', li ).length > 0 || li.hasClass('hasChildren') )
                {
                    li.prepend('<div class="hitarea openCategoryButton"></div>');
                    li.addClass('collapsable');
                }

                // Пометим специальным классом последнюю ветку
                s( 'li:last-child', li ).addClass('last');
            })
                // Обработчик "сворачивания"/"разворачивания" ветки дерева
                .click( function(li)
                {
                    // "Передернем" класс для сокрытия ветки дерева
                    li.toggleClass('collapsed');

                }, false, true );


            // Обработчик "сворачивания"/"разворачивания" ветки дерева
            s('.hitarea', _self).click( function(ha)
            {
                // "Передернем" класс для сокрытия ветки дерева
                ha.parent().toggleClass('collapsed');
            }, false, true );

        }

        /**
         * Обработчик принудительного "сворачивания" дерева.
         * Если нечего не передано - свернем все дерево целеком
         *
         * @param li Указатель на конкретную ветку дерева для сворачивания
         * @return SamsonJS Указатель на самого себя для цепирования
         */
        this.collapse = function( li )
        {
            // Указатель на ветки деревье для сворачивания
            var selector = null;

            // Если конкретная ветка дерева не указана - "свернем" все ветки дерева
            if( ! li ) selector = s( 'li', _self );
            // Иначе свернем конкретную ветку дерева
            else selector = li;

            // Выполним "сворачивание"
            selector.addClass('collapsed');
        };

        var asyncEvent = function SJSTreeInitHitArea(tree) {
            s('.openCategoryButton', tree).each(function(link) {
                link.click(function() {
                    if (!link.hasClass('children-uploaded')) {
                        link.addClass('loading');
                        var parent = link.parent();
                        var id = s('.structure_id', parent).html();
                        var controller = 'structure/addchildren';
                        if (parent.a('controller') !== undefined ) {
                            controller = parent.a('controller');
                        }
                        s.ajax(controller + id, function(response) {
                            response = JSON.parse(response);
                            parent.append(response.tree);
                            link.addClass('children-uploaded');

                            if (completeHandler) {
                                s('ul', parent).addClass('sjs-treeview');
                                completeHandler(s('ul', parent));
                            }
                            link.removeClass('loading');
                        });
                        parent.removeClass('collapsed');
                    }
                });
            });
        };

        if (useAsyncRendering) {
            _self.collapse();
            asyncEvent(_self);
        }



        // Вернем указатель на самого себя для цепирования
        return _self;
    }
};

// Добавим плагин к SamsonJS
SamsonJS.extend( SamsonJSTreeview );
