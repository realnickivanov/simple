$(function () {
    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    var
        courseId = getURLParameter('courseId'),
        templateId = getURLParameter('templateId'),

        baseURL = location.protocol + "//" + location.host,
        settingsURL = baseURL + "/api/course/" + courseId + "/template/" + templateId,

        index = location.toString().indexOf('/settings/settings.html'),
        templateUrl = location.toString().substring(0, index),

        starterAccessType = 1;

    var viewModel = {
        trackingData: (function () {
            var data = {};

            data.enableXAPI = ko.observable(true),

            data.lrsOptions = [
                { key: 'default', text: 'easygenerator (recommended)' },
                { key: 'custom', text: 'custom LRS' }
            ];
            data.selectedLrs = ko.observable(data.lrsOptions[0].key);

            data.customLrsEnabled = ko.computed(function () {
                return data.enableXAPI() && data.selectedLrs() != data.lrsOptions[0].key;
            });

            data.lrsUrl = ko.observable('');
            data.authenticationRequired = ko.observable(false);
            data.lapLogin = ko.observable();
            data.lapPassword = ko.observable();

            data.credentialsEnabled = ko.computed(function () {
                return data.customLrsEnabled() && data.authenticationRequired();
            });

            data.statements = {
                started: ko.observable(true),
                stopped: ko.observable(true),
                experienced: ko.observable(true),
                mastered: ko.observable(true),
                answered: ko.observable(true),
                passed: ko.observable(true),
                failed: ko.observable(true)
            };

            return data;
        })(),

        isSaved: ko.observable(false),
        isFailed: ko.observable(false),

        logo: (function () {
            var logo = {};

            logo.url = ko.observable('').extend({ throttle: 300 });
            logo.hasLogo = ko.computed(function () {
                return logo.url() !== '';
            });
            logo.clear = function () {
                logo.url('');
            };
            logo.isError = ko.observable(false);
            logo.errorText = ko.observable('');
            logo.errorDescription = ko.observable('');
            logo.isLoading = ko.observable(false);

            return logo;
        })(),

        themes: (function () {
            var themes = {};

            themes.list = [
                {
                    title: 'Cartoon light',
                    key: 'cartoon'
                },
                {
                    title: 'Grey scheme',
                    key: 'grey'
                },
                {
                    title: 'Black scheme',
                    key: 'black'
                },
                {
                    title: 'Flat scheme',
                    key: 'flat'
                }
            ];
            themes.default = 'cartoon';
            themes.selected = ko.observable('');

            ko.utils.arrayMap(themes.list, function (theme) {
                theme.isSelected = ko.observable(false);
                theme.select = function () {
                    ko.utils.arrayForEach(themes.list, function (item) {
                        item.isSelected(false);
                    });
                    theme.isSelected(true);
                    themes.selected(theme.key);
                };
                return theme;
            });

            themes.setSelected = function (key) {
                var theme = ko.utils.arrayFirst(themes.list, function (item) {
                    return item.key == key;
                });
                if (!!theme) {
                    theme.select();
                }
            };

            themes.setSelected(themes.default);

            themes.openDemo = function () {
                window.open(templateUrl + '?v=' + new Date().getTime() + '&theme=' + themes.selected(), '_blank');
            };

            return themes;
        })(),

        defaultTranslations: {
            en: [
                    { key: '[course]', value: 'Course:' },
                    { key: '[start course]', value: 'Start course' },
                    { key: '[finish course]', value: 'Finish course' },
                    { key: '[learning objectives]', value: 'Learning objectives:' },
                    { key: '[start]', value: 'Start' },
                    { key: '[home]', value: 'Home' },
                    { key: '[learning content]', value: 'Learning content' },
                    { key: '[submit]', value: 'Submit' },
                    { key: '[try again]', value: 'Try again' },
                    { key: '[next]', value: 'Next' },
                    { key: '[correct answer]', value: 'Correct answer' },
                    { key: '[incorrect answer]', value: 'Incorrect answer' },
                    { key: '[previous question]', value: 'previous' },
                    { key: '[next question]', value: 'next' },
                    { key: '[of]', value: 'of' },
                    { key: '[to complete]', value: 'to complete' },
                    { key: '[text matching question hint]', value: 'Drag items from right column to the left to match the pairs' },
                    { key: '[text matching question drop here]', value: 'Drop here' },
                    { key: '[statement question true text]', value: 'True' },
                    { key: '[statement question false text]', value: 'False' },
                    { key: '[drag and drop question all texts are placed]', value: 'All texts are placed' },
                    { key: '[drag and drop question drop here]', value: 'Drop here' },
                    { key: '[fill in the blank choose answer]', value: 'Choose the answer...' },
                    { key: '[thank you message]', value: 'Thank you, you can close the page now' },
                    { key: '[there are no questions]', value: 'No questions' },
                    { key: '[browser not supported]', value: 'Your browser is currently not supported.' },
                    { key: '[browser not supported hint]', value: 'Don’t worry, there is an easy fix. All you have to do is click one of the icons below and follow the instructions.' },
                    { key: '[page not found title]', value: 'Page not found (404)' },
                    { key: '[page not found message]', value: "Sorry, the page you have been looking for has not been found. Try checking the URL on errors, use the navigation above or click 'Home' link below." },
                    { key: '[tracking and tracing header]', value: 'Your credentials for progress tracking' },
                    { key: '[tracking and tracing hint]', value: 'Please enter your credentials and click "Start and report my results "to enable result tracking. Otherwise, click "Do not report, just start".' },
                    { key: '[tracking and tracing name field]', value: 'Your name' },
                    { key: '[tracking and tracing email field]', value: 'Your e-mail' },
                    { key: '[tracking and tracing name is not valid]', value: 'Fill in your name' },
                    { key: '[tracking and tracing email is not valid]', value: 'Enter a valid e-mail' },
                    { key: '[tracking and tracing skip reporting]', value: 'Do not report, just start' },
                    { key: '[tracking and tracing start]', value: 'Start and report my results' },
                    { key: '[tracking and tracing error]', value: 'Something is wrong' },
                    { key: '[tracking and tracing error hint]', value: 'If you continue without restarting, your learning results will not be reported.' },
                    { key: '[tracking and tracing restart course]', value: 'Restart course' },
                    { key: '[tracking and tracing continue anyway]', value: 'Continue anyway' },
                    { key: '[tracking and tracing reporting progress]', value: 'reporting results...' }
            ],

            nl: [
                    { key: '[course]', value: 'Cursus:' },
                    { key: '[start course]', value: 'Start cursus' },
                    { key: '[finish course]', value: 'Stop cursus' },
                    { key: '[learning objectives]', value: 'Leerdoelen:' },
                    { key: '[start]', value: 'Start' },
                    { key: '[home]', value: 'Home' },
                    { key: '[learning content]', value: 'Leerstof' },
                    { key: '[submit]', value: 'Invoeren' },
                    { key: '[try again]', value: 'Probeer opnieuw' },
                    { key: '[next]', value: 'Volgende' },
                    { key: '[correct answer]', value: 'Juist antwoord' },
                    { key: '[incorrect answer]', value: 'Onluist antwoord' },
                    { key: '[previous question]', value: 'Vorige' },
                    { key: '[next question]', value: 'Volgende' },
                    { key: '[of]', value: 'van' },
                    { key: '[to complete]', value: 'compleet' },
                    { key: '[text matching question hint]', value: 'Sleep items van de rechterkolom naar links om kloppende paren te maken' },
                    { key: '[text matching question drop here]', value: 'Plaats hier' },
                    { key: '[statement question true text]', value: 'Waar' },
                    { key: '[statement question false text]', value: 'Niet waar' },
                    { key: '[drag and drop question all texts are placed]', value: 'Alle teksten zijn geplaatst' },
                    { key: '[drag and drop question drop here]', value: 'Plaats hier' },
                    { key: '[fill in the blank choose answer]', value: 'Kies het antwoord…' },
                    { key: '[thank you message]', value: 'Bedankt, je kan nu de pagina sluiten' },
                    { key: '[there are no questions]', value: 'Geen vragen' },
                    { key: '[browser not supported]', value: 'Uw browser wordt niet ondersteund.' },
                    { key: '[browser not supported hint]', value: 'Maak je geen zorgen er is een simpeleoplossing. Klik op een van de iconen beneden en volg de instructies' },
                    { key: '[page not found title]', value: 'Pagina niet gevonden (404)' },
                    { key: '[page not found message]', value: "Sorry, de pagina is niet gevonden. Controleer de link of klik op home." },
                    { key: '[tracking and tracing header]', value: 'Je gegevens om de resultaten op te slaan' },
                    { key: '[tracking and tracing hint]', value: "Vul je gegevens in en druk op 'Start en leg mijn resultaten vast'. Of klik op 'leg mijn resultaten niet vast'" },
                    { key: '[tracking and tracing name field]', value: 'Naam' },
                    { key: '[tracking and tracing email field]', value: 'Email' },
                    { key: '[tracking and tracing name is not valid]', value: 'Vul je naam in' },
                    { key: '[tracking and tracing email is not valid]', value: 'Voer een geldig email adres in' },
                    { key: '[tracking and tracing skip reporting]', value: 'Leg mijn resultaten niet vast' },
                    { key: '[tracking and tracing start]', value: 'Start en leg mijn resultaten vast' },
                    { key: '[tracking and tracing error]', value: 'Er is iets misgegaan' },
                    { key: '[tracking and tracing error hint]', value: 'Als je doorgaat worden je leerresultaten niet vastgelegd' },
                    { key: '[tracking and tracing restart course]', value: 'Herstart cursus' },
                    { key: '[tracking and tracing continue anyway]', value: 'Ga door' },
                    { key: '[tracking and tracing reporting progress]', value: 'Resultaten vastleggen...' }
            ],
            ua: [
                    { key: "[course]", value: "Курс :" },
                    { key: "[start course]", value: "Почати курс" },
                    { key: "[finish course]", value: "Закінчити курс" },
                    { key: "[learning objectives]", value: "Мета навчання:" },
                    { key: "[start]", value: "Почати" },
                    { key: "[home]", value: "Головна" },
                    { key: "[learning content]", value: "Навчальный матеріал" },
                    { key: "[submit]", value: "Відповісти" },
                    { key: "[try again]", value: "Спробувати ще" },
                    { key: "[next]", value: "Далі" },
                    { key: "[correct answer]", value: "Вірна відповідь" },
                    { key: "[incorrect answer]", value: "Відповідь не вірна" },
                    { key: "[previous question]", value: "Назад" },
                    { key: "[next question]", value: "Вперед" },
                    { key: '[of]', value: 'з' },
                    { key: '[to complete]', value: 'для досягнення цілі' },
                    { key: "[text matching question hint]", value: "Перетягніть відповіді з правої колонки до лівої таким чином, щоб вони відповідали визначенням з першої колонки" },
                    { key: "[text matching question drop here]", value: "Сюди" },
                    { key: "[statement question true text]", value: "Вірно" },
                    { key: "[statement question false text]", value: "Невірно" },
                    { key: "[drag and drop question all texts are placed]", value: "Усі тексти вже використані" },
                    { key: "[drag and drop question drop here]", value: "Сюди" },
                    { key: "[fill in the blank choose answer]", value: "Оберіть варіант..." },
                    { key: "[thank you message]", value: "Дякуємо. Тепер сторінку можна закрити" },
                    { key: "[there are no questions]", value: "Питання відсутні" },
                    { key: "[browser not supported]", value: "Ваш браузер не підтримується" },
                    { key: "[browser not supported hint]", value: "Не хвилюйтеся, це легко виправити. Все, що вам потрібно - це натиснути на одну з іконок, розташованих нижче і дотримуватись інструкцій" },
                    { key: "[page not found title]", value: "Сторінка не знайдена (404)" },
                    { key: "[page not found message]", value: "Вибачте, але сторінку, яку ви шукали, не знайдено. Спробуйте перевірити URL на помилки, використати навігацію вище або посилання на головну сторінку нижче." },
                    { key: "[tracking and tracing header]", value: "Ваші дані для відправки результатів" },
                    { key: "[tracking and tracing hint]", value: "Будь-ласка, вкажіть необхідні дані та натисніть \"Почати курс та відстежувати мій прогрес\" для того, щоб відправляти результати. Якщо Ви не бажаєте відстежувати прогрес, натисніть \"Почати курс без відправки результатів\"" },
                    { key: "[tracking and tracing name field]", value: "Ваше ім'я" },
                    { key: "[tracking and tracing email field]", value: "Ваша електронна адреса" },
                    { key: "[tracking and tracing name is not valid]", value: "Вкажіть Ваше ім'я" },
                    { key: "[tracking and tracing email is not valid]", value: "Вкажіть дійсну електронну адресу" },
                    { key: "[tracking and tracing skip reporting]", value: "Пропустити цей крок" },
                    { key: "[tracking and tracing start]", value: "Так, відстежувати мій прогрес" },
                    { key: "[tracking and tracing error]", value: "Помилка" },
                    { key: "[tracking and tracing error hint]", value: "Натисніть 'Спробувати ще'. Якщо помилка повторюється і ви бажаєте продовжити курс без відправки результатів - натисніть 'Продовжити'." },
                    { key: "[tracking and tracing restart course]", value: "Спробувати ще" },
                    { key: "[tracking and tracing continue anyway]", value: "Продовжити" },
                    { key: "[tracking and tracing reporting progress]", value: "Надсилаемо прогресс..." }
            ],

            xx: [
                    { key: '[course]', value: ko.observable('Course:') },
                    { key: '[start course]', value: ko.observable('Start course') },
                    { key: '[finish course]', value: ko.observable('Finish course') },
                    { key: '[learning objectives]', value: ko.observable('Learning objectives:') },
                    { key: '[start]', value: ko.observable('Start') },
                    { key: '[home]', value: ko.observable('Home') },
                    { key: '[learning content]', value: ko.observable('Learning content') },
                    { key: '[submit]', value: ko.observable('Submit') },
                    { key: '[try again]', value: ko.observable('Try again') },
                    { key: '[next]', value: ko.observable('Next') },
                    { key: '[correct answer]', value: ko.observable('Correct answer') },
                    { key: '[incorrect answer]', value: ko.observable('Incorrect answer') },
                    { key: '[previous question]', value: ko.observable('previous') },
                    { key: '[next question]', value: ko.observable('next') },
                    { key: '[of]', value: ko.observable('of') },
                    { key: '[to complete]', value: ko.observable('to complete') },
                    { key: '[text matching question hint]', value: ko.observable('Drag items from right column to the left to match the pairs') },
                    { key: '[text matching question drop here]', value: ko.observable('Drop here') },
                    { key: '[statement question true text]', value: ko.observable('True') },
                    { key: '[statement question false text]', value: ko.observable('False') },
                    { key: '[drag and drop question all texts are placed]', value: ko.observable('All texts are placed') },
                    { key: '[drag and drop question drop here]', value: ko.observable('Drop here') },
                    { key: '[fill in the blank choose answer]', value: ko.observable('Choose the answer...') },
                    { key: '[thank you message]', value: ko.observable('Thank you. It is now safe to close this page.') },
                    { key: '[there are no questions]', value: ko.observable('No questions') },
                    { key: '[browser not supported]', value: ko.observable('Your browser is currently not supported.') },
                    { key: '[browser not supported hint]', value: ko.observable('Don’t worry, there is an easy fix. All you have to do is click one of the icons below and follow the instructions.') },
                    { key: '[page not found title]', value: ko.observable('Page not found (404)') },
                    { key: '[page not found message]', value: ko.observable("Sorry, the page you have been looking for has not been found. Try checking the URL on errors, use the navigation above or click 'Home' link below.") },
                    { key: '[tracking and tracing header]', value: ko.observable('Your credentials for progress tracking') },
                    { key: '[tracking and tracing hint]', value: ko.observable('Please enter your credentials and click "Start and report my progress" to enable progress tracking. Otherwise, click "Do not report, just start".') },
                    { key: '[tracking and tracing name field]', value: ko.observable('Your name') },
                    { key: '[tracking and tracing email field]', value: ko.observable('Your e-mail') },
                    { key: '[tracking and tracing name is not valid]', value: ko.observable('Fill in your name') },
                    { key: '[tracking and tracing email is not valid]', value: ko.observable('Enter a valid e-mail') },
                    { key: '[tracking and tracing skip reporting]', value: ko.observable('Do not report, just start') },
                    { key: '[tracking and tracing start]', value: ko.observable('Start and report my progress') },
                    { key: '[tracking and tracing error]', value: ko.observable('Something is wrong') },
                    { key: '[tracking and tracing error hint]', value: ko.observable('If you continue without restarting, your learning progress will not be reported.') },
                    { key: '[tracking and tracing restart course]', value: ko.observable('Restart course') },
                    { key: '[tracking and tracing continue anyway]', value: ko.observable('Continue anyway') },
                    { key: '[tracking and tracing reporting progress]', value: ko.observable('reporting progress...') }
            ]
        },

        languages: [
            {
                key: "en",
                name: "English"
            },
            {
                key: "nl",
                name: "Dutch"
            },
            {
                key: "ua",
                name: "Ukrainian"
            },
            {
                key: "xx",
                name: "Custom"
            }
        ],

        hasStarterPlan: ko.observable(true),
        masteryScore: ko.observable('')
    };

    viewModel.escapeHtml = function (html) {
        return $('<div/>').text(html).html();
    }

    viewModel.unescapeHtml = function (text) {
        return $('<div/>').html(text).text();
    }

    viewModel.selectedLanguage = ko.observable(viewModel.languages[0].key);

    viewModel.isCustom = ko.computed(function () {
        var language = viewModel.selectedLanguage();
        return language == "xx";
    });

    viewModel.translations = ko.computed(function () {
        return viewModel.defaultTranslations[viewModel.selectedLanguage()];
    });

    viewModel.getCustomTranslations = function () {
        return viewModel.defaultTranslations["xx"];
    }

    viewModel.saveChanges = function () {
        var settings = {
            logo: {
                url: viewModel.logo.url()
            },
            xApi: {
                enabled: viewModel.trackingData.enableXAPI(),
                selectedLrs: viewModel.trackingData.selectedLrs(),
                lrs: {
                    uri: viewModel.trackingData.lrsUrl(),
                    authenticationRequired: viewModel.trackingData.authenticationRequired(),
                    credentials: {
                        username: viewModel.trackingData.lapLogin(),
                        password: viewModel.trackingData.lapPassword()
                    }
                },
                allowedVerbs: $.map(viewModel.trackingData.statements, function (value, key) {
                    return value() ? key : undefined;
                })
            },
            masteryScore: {
                score: viewModel.masteryScore()
            },
            theme: {
                key: viewModel.themes.selected()
            },
            translations: $.map(viewModel.defaultTranslations[viewModel.selectedLanguage()], function (item) {
                return { key: item.key, value: viewModel.escapeHtml(viewModel.isCustom() ? item.value() : item.value) };
            })
        };

        viewModel.isFailed(false);
        viewModel.isSaved(false);

        var extraData = {
            selectedLanguage: viewModel.selectedLanguage(),
            customTranslations: $.map(viewModel.getCustomTranslations(), function (value) {
                return { key: value.key, value: viewModel.escapeHtml(value.value()) };
            })
        }

        $.post(settingsURL, { settings: JSON.stringify(settings), extraData: JSON.stringify(extraData) })
            .done(function () {
                viewModel.isSaved(true);
            })
            .fail(function () {
                viewModel.isFailed(true);
            });
    };

    //#region Binding handlers

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.unwrap(value)) {
                $(element).fadeIn();
            } else {
                $(element).fadeOut();
            }
        }
    };

    ko.bindingHandlers.number = {
        init: function (element) {
            var $element = $(element),
                maxValue = 100;
            $element.on('keydown', function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) ||
                        (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $element.on('keyup', function () {
                if ($(this).val() > maxValue) {
                    $(this).val(maxValue);
                }
            });
        }
    };

    ko.bindingHandlers.disableDragNDrop = {
        init: function (element) {
            $(element).on('dragstart', function (event) {
                event.preventDefault();
            });
        }
    };

    ko.bindingHandlers.spinner = {
        init: function (element, valueAccessor) {
            var masteryScore = valueAccessor();

            $(element).spinner('changed', function (e, newValue) {
                masteryScore(newValue);
            });

        }
    };

    ko.bindingHandlers.switchToggle = {
        init: function (element, valueAccessor) {
            var switchToggle = ko.bindingHandlers.switchToggle,
                viewModel = switchToggle.viewModel(element, valueAccessor),
                value = ko.unwrap(valueAccessor().value());

            viewModel.setInitialValue(value);

            switchToggle.onClick(element, function () {
                viewModel.toggle();

                var currentValue = ko.unwrap(valueAccessor().value());
                valueAccessor().value(!currentValue);
            });
        },
        update: function (element, valueAccessor) {
            var viewModel = ko.bindingHandlers.switchToggle.viewModel(element, valueAccessor),
                value = ko.unwrap(valueAccessor().value());

            viewModel.updateValue(value);
        },
        viewModel: function (element) {
            var $element = $(element),
                $wrapper = $('.switch-toggle-wrapper', $element);

            function setInitialValue(value) {
                setElementValue(value);
                updateElementPosition(value);
            }

            function toggle() {
                var value = getValue();
                setElementValue(!value);

                $wrapper.stop().animate({
                    marginLeft: calculateElementLeftMargin(!value)
                }, 250);
            }

            function getValue() {
                return $element.hasClass('on');
            }

            function updateValue(value) {
                if (getValue() != value) {
                    setInitialValue(value);
                }
            }

            function setElementValue(value) {
                $element.toggleClass('on', value);
                $element.toggleClass('off', !value);
            }

            function updateElementPosition(value) {
                $wrapper.css('margin-left', calculateElementLeftMargin(value) + 'px');
            }

            function calculateElementLeftMargin(value) {
                return value ? 0 : $element.height() - $element.width();
            }

            return {
                setInitialValue: setInitialValue,
                updateValue: updateValue,
                toggle: toggle
            }
        },
        onClick: function (element, handler) {
            var $element = $(element),
                isMouseDownFired = false;

            $element.mousedown(function (event) {
                if (event.which != 1)
                    return;

                isMouseDownFired = true;
                handler();
            });

            $element.click(function () {
                if (isMouseDownFired) {
                    isMouseDownFired = false;
                    return;
                }

                handler();
            });
        }
    };

    ko.bindingHandlers.dropdown = {
        cssClasses: {
            dropdown: 'dropdown',
            disabled: 'disabled',
            expanded: 'expanded',
            optionsList: 'dropdown-options-list',
            optionItem: 'dropdown-options-item',
            currentItem: 'dropdown-current-item',
            currentItemText: 'dropdown-current-item-text',
            indicatorHolder: 'dropdown-indicator-holder',
            indicator: 'dropdown-indicator'
        },
        init: function (element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses;

            $element.addClass(cssClasses.dropdown);

            var $currentItemElement = $('<div />')
                .addClass(cssClasses.currentItem)
                .appendTo($element);

            $('<div />')
                .addClass(cssClasses.currentItemText)
                .appendTo($currentItemElement);

            var $indicatorHolder = $('<div />')
                .addClass(cssClasses.indicatorHolder)
                .appendTo($currentItemElement);

            $('<span />')
                .addClass(cssClasses.indicator)
                .appendTo($indicatorHolder);

            $('<ul />')
                .addClass(cssClasses.optionsList)
                .appendTo($element);

            $currentItemElement.on('click', function (e) {
                if ($element.hasClass(cssClasses.disabled)) {
                    return;
                }

                $currentItemElement.toggleClass(cssClasses.expanded);
                e.stopPropagation();
            });

            var collapseHandler = function () {
                $currentItemElement.removeClass(cssClasses.expanded);
            };

            $('html').bind('click', collapseHandler);
            $(window).bind('blur', collapseHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $('html').unbind('click', collapseHandler);
                $(window).unbind('blur', collapseHandler);
            });
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses,

                $optionsListElement = $element.find('ul.' + cssClasses.optionsList),
                $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText);


            var options = valueAccessor().options,
                optionsText = valueAccessor().optionsText,
                value = valueAccessor().value,
                optionsValue = valueAccessor().optionsValue,
                currentValue = ko.unwrap(value),
                disable = ko.unwrap(valueAccessor().disable);

            if (disable) {
                $element.toggleClass(cssClasses.disabled);
            } else {
                $element.removeClass(cssClasses.disabled);
            }

            $optionsListElement.empty();

            $.each(options, function (index, option) {
                if (option[optionsValue] == currentValue) {
                    $currentItemTextElement.text(option[optionsText]);
                    return;
                }

                $('<li />')
                    .addClass(cssClasses.optionItem)
                    .appendTo($optionsListElement)
                    .text(option[optionsText])
                    .on('click', function (e) {
                        value(option[optionsValue]);
                        $element.trigger('change');
                    });
            });
        }
    };

    //#endregion Binding handlers

    ko.applyBindings(viewModel, $("#settingsForm")[0]);

    //#region Image uploader

    var imageUploader = {
        apiUrl: baseURL + '/storage/image/upload',
        maxFileSize: 10, //MB
        supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
        somethingWentWrongMessage: { title: 'Something went wrong', description: 'Please, try again' },

        status: {
            default: function () {
                viewModel.logo.isLoading(false);
                viewModel.logo.isError(false);
            },
            fail: function (reason) {
                viewModel.logo.clear();
                viewModel.logo.isLoading(false);
                viewModel.logo.errorText(reason.title);
                viewModel.logo.errorDescription(reason.description);
                viewModel.logo.isError(true);
            },
            loading: function () {
                viewModel.logo.isLoading(true);
            }
        },

        button: {
            enable: function () {
                this.$input.attr('disabled', false).closest('.image-upload-button').removeClass('disabled');
            },
            disable: function () {
                this.$input.attr('disabled', true).closest('.image-upload-button').addClass('disabled');
            },
            submit: function () {
                this.$input[0].form.submit();
                this.disable();
                imageUploader.status.loading();
            },
            $input: $('#logoInput')
        },

        init: function () {
            imageUploader.button.$input.on('change', imageUploader.processFile);
            imageUploader.button.enable();
        },

        processFile: function () {
            if (!this.files) {
                imageUploader.button.submit();
                return;
            }
            if (this.files.length === 0) {
                return;
            }

            var file = this.files[0],
                fileExtension = file.name.split('.').pop().toLowerCase();

            if ($.inArray(fileExtension, imageUploader.supportedExtensions) === -1) {
                imageUploader.status.fail({ title: 'Unsupported image format', description: '(Allowed formats: ' + imageUploader.supportedExtensions.join(', ') + ')' });
                return;
            }
            if (file.size > imageUploader.maxFileSize * 1024 * 1024) {
                imageUploader.status.fail({ title: 'File is too large', description: '(Max file size: ' + imageUploader.maxFileSize + 'MB)' });
                return;
            }
            imageUploader.uploadFile(file);
        },

        uploadFile: function (file) {
            imageUploader.button.disable();
            imageUploader.status.loading();

            var formData = new FormData();
            formData.append("file", file);

            $.ajax({
                url: imageUploader.apiUrl,
                type: 'POST',
                data: formData,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            }).done(function (response) {
                imageUploader.handleResponse(response);
            }).fail(function () {
                imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                imageUploader.button.enable();
            });
        },

        handleResponse: function (response) {
            try {
                if (!response) {
                    throw "Response is empty";
                }

                if (typeof response != "object") {
                    response = JSON.parse(response);
                }

                if (!response || !response.success || !response.data) {
                    throw "Request is not success";
                }

                viewModel.logo.url(response.data.url);
                imageUploader.status.default();
            } catch (e) {
                imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
            } finally {
                imageUploader.button.enable();
            }
        }
    };

    //#endregion Image uploader

    //#region Ajax requests

    $.ajax({
        cache: false,
        url: settingsURL,
        dataType: "json",
        success: function (response) {
            var defaultSettings = { logo: {}, xApi: { enabled: true, selectedLrs: "default", lrs: { credentials: {} } }, masteryScore: {} },
                defaultExtraData = { customTranslations: [] };

            var settings, extraData;
            try {
                settings = JSON.parse(response.settings) || defaultSettings;
            } catch (e) {
                settings = defaultSettings;
            }
            try {
                extraData = JSON.parse(response.extraData) || defaultExtraData;
            } catch (e) {
                extraData = defaultExtraData;
            }

            viewModel.trackingData.enableXAPI(settings.xApi.enabled || false);
            var defaultLrs = settings.xApi.enabled ? 'custom' : 'default';
            viewModel.trackingData.selectedLrs(settings.xApi.selectedLrs || defaultLrs);
            viewModel.trackingData.lrsUrl(settings.xApi.lrs.uri || '');
            viewModel.trackingData.authenticationRequired(settings.xApi.lrs.authenticationRequired || false);
            viewModel.trackingData.lapLogin(settings.xApi.lrs.credentials.username || '');
            viewModel.trackingData.lapPassword(settings.xApi.lrs.credentials.password || '');

            if (settings.xApi.allowedVerbs) {
                $.each(viewModel.trackingData.statements, function (key, value) {
                    value($.inArray(key, settings.xApi.allowedVerbs) > -1);
                });
            }

            viewModel.logo.url(settings.logo.url || '');
            if (typeof settings.masteryScore != 'undefined' && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            } else {
                viewModel.masteryScore(100);
            }

            if (settings.theme && settings.theme.key) {
                viewModel.themes.setSelected(settings.theme.key);
            }

            var customTranslations = viewModel.getCustomTranslations();

            if (extraData.customTranslations.length == 0 && settings.translations != null) {
                $.each(settings.translations, function (i) {
                    $.each(customTranslations, function (j) {
                        if (settings.translations[i].key === customTranslations[j].key) {
                            customTranslations[j].value(viewModel.unescapeHtml(settings.translations[i].value));
                        }
                    });
                });

                viewModel.selectedLanguage("xx");
                return;
            }

            $.each(extraData.customTranslations, function (i) {
                $.each(customTranslations, function (j) {
                    if (extraData.customTranslations[i].key === customTranslations[j].key) {
                        customTranslations[j].value(viewModel.unescapeHtml(extraData.customTranslations[i].value));
                    }
                });
            });

            if (extraData.selectedLanguage != null && extraData.selectedLanguage != undefined) {
                viewModel.selectedLanguage(extraData.selectedLanguage);
            }
        },
        error: function () {
            viewModel.masteryScore(100);
        }
    });

    $.ajax({
        url: baseURL + '/api/identify',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (user) {
            if (user.hasOwnProperty('subscription') && user.subscription.hasOwnProperty('accessType')) {
                var hasStarterAccess = user.subscription.accessType >= starterAccessType && new Date(user.subscription.expirationDate) >= new Date();
                viewModel.hasStarterPlan(hasStarterAccess);

                if (hasStarterAccess) {
                    imageUploader.init();
                }
            } else {
                viewModel.hasStarterPlan(false);
            }
        },
        error: function () {
            viewModel.hasStarterPlan(false);
        }
    });

    //#endregion Ajax requests

});