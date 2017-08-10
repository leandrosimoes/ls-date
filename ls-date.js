; (function (document, window, commonjs) {
    function addPrototypeFunctionIfNotExist(name, callback) {
        if (!Date.prototype[name]) {
            Date.prototype[name] = callback;
        } else {
            console.log('The "' + name + '" function aready exists in Date.prototype.');
        }
    };

    // Setting the prototype functions
    addPrototypeFunctionIfNotExist('addDays', function (days) {
        days = days || 0;

        var newDate = new Date(this.getFullYear(), this.getMonth(), this.getDate());
        newDate.setDate(newDate.getDate() + days);

        return newDate;
    });

    addPrototypeFunctionIfNotExist('isHolyday', function (state) {
        return ls_date.isHolyday({ date: this, state: state });
    });

    addPrototypeFunctionIfNotExist('isWeekend', function () {
        return ls_date.isWeekend(this);
    });

    addPrototypeFunctionIfNotExist('isWorkDay', function (state) {
        return ls_date.isWorkDay({ date: this, state: state });
    });

    addPrototypeFunctionIfNotExist('getNextHolyday', function (state) {
        return ls_date.getNextHolyday({ date: this, state: state });
    });

    addPrototypeFunctionIfNotExist('getAllHolydaysOfTheYear', function (state) {
        return ls_date.getAllHolydaysOfTheYear({ date: this, state: state });
    });

    // Algorithm Source: http://www.inf.ufrgs.br/~cabral/Pascoa.html
    function getEasterDate(currentDate) {
        var currentYear = currentDate.getFullYear();

        function getXY() {
            if (currentYear >= 1582 && currentYear <= 1599) {
                return { x: 22, y: 2 };
            } else if (currentYear >= 1600 && currentYear <= 1699) {
                return { x: 22, y: 2 };
            } else if (currentYear >= 1700 && currentYear <= 1799) {
                return { x: 23, y: 3 };
            } else if (currentYear >= 1800 && currentYear <= 1899) {
                return { x: 24, y: 4 };
            } else if (currentYear >= 1900 && currentYear <= 2019) {
                return { x: 24, y: 5 };
            } else if (currentYear >= 2020 && currentYear <= 2099) {
                return { x: 24, y: 5 };
            } else if (currentYear >= 2100 && currentYear <= 2199) {
                return { x: 24, y: 6 };
            } else if (currentYear >= 2200 && currentYear <= 2299) {
                return { x: 25, y: 7 };
            } else {
                throw 'The current year "' + currentYear + '" is not a valid year.';
            }
        };

        var x = getXY().x,
                y = getXY().y,
                a = currentYear % 19,
                b = currentYear % 4,
                c = currentYear % 7,
                d = (19 * a + x) % 30,
                e = (2 * b + 4 * c + 6 * d + y) % 7;

        var easterDate = new Date(currentDate);
        if ((d + e) > 9) {
            easterDate.setDate((d + e - 9));
            easterDate.setMonth(ls_date.months.april);
        } else {
            easterDate.setDate(d + e + 22);
            easterDate.setMonth(ls_date.months.march);
        }

        if (easterDate.getMonth() === ls_date.months.april) {
            if (easterDate.getDate() === 26) {
                easterDate.setDate(19);
            }

            if (easterDate.getDate() === 25 && d === 28 && a > 10) {
                easterDate.setDate(18);
            }
        }

        return easterDate;
    };
    function getHolyFriday(easterDate) {
        if (!(easterDate instanceof Date)) throw 'Easter date is not a valid date';

        while (easterDate.getDay() !== 0) {
            easterDate.addDays(-1);
        }

        return easterDate;
    };
    function sortHolydays(holydays) {
        holydays = holydays.sort(function (a, b) {
            return a.date - b.date;
        });

        return holydays;
    }
    function initHolydays(date, state) {
        var allHolydays = [];
        allHolydays = allHolydays.concat(holydays.electionDays(date));
        allHolydays = allHolydays.concat(holydays.fixedNationalHolydays(date));
        allHolydays = allHolydays.concat(holydays.fixedStateHolydays(state, date));
        allHolydays = allHolydays.concat(holydays.localHolydays);
        allHolydays = allHolydays.concat(holydays.nonFixedNationalHolydays(date));

        allHolydays = sortHolydays(allHolydays);

        return allHolydays;
    }

    var holydays = {
        // This is the most common election dates in Brazil
        // But is not a rule. So if you want to change it, use the 'setElectionDays' function
        electionDays: function (currentDate) {
            return [
                { name: 'Primeiro Turno das Eleições', date: new Date(currentDate.getFullYear(), ls_date.months.october, 3) },
                { name: 'Segundo Turno das Eleições', date: new Date(currentDate.getFullYear(), ls_date.months.november, 15) }
            ]
        },
        localHolydays: [],
        nonFixedNationalHolydays: function (currentDate) {
            var holydays = [];

            var easter = getEasterDate(currentDate),
                carnival = easter.addDays(-47),
                corpusChristi = easter.addDays(60),
                holyFriday = getHolyFriday(easter);

            holydays.push({ name: 'Páscoa', date: easter });
            holydays.push({ name: 'Carnaval', date: carnival });
            holydays.push({ name: 'Corpus Christi', date: corpusChristi });

            // The Holy Friday day is not valid for all the states,
            // so if you want to consider this holyday just set the
            // 'useHolyFriday' property to 'true'
            if (!!ls_date.useHolyFriday) {
                holydays.push({ name: 'Sexta-feira Santa', date: holyFriday });
            }

            return holydays;
        },
        fixedNationalHolydays: function (currentDate) {
            return [
                { name: 'Ano Novo', date: new Date(currentDate.getFullYear(), ls_date.months.january, 1) },
                { name: 'Dia de Tiradentes', date: new Date(currentDate.getFullYear(), ls_date.months.april, 21) },
                { name: 'Dia do Trabalho', date: new Date(currentDate.getFullYear(), ls_date.months.may, 1) },
                { name: 'Dia da Independência do Brasil', date: new Date(currentDate.getFullYear(), ls_date.months.september, 7) },
                { name: 'Dia de Nossa Sra. Aparecida', date: new Date(currentDate.getFullYear(), ls_date.months.october, 12) },
                { name: 'Dia de Finados', date: new Date(currentDate.getFullYear(), ls_date.months.november, 2) },
                { name: 'Dia da Proclamação da República', date: new Date(currentDate.getFullYear(), ls_date.months.november, 17) },
                { name: 'Natal', date: new Date(currentDate.getFullYear(), ls_date.months.december, 25) }
            ]
        },
        // Source: https://pt.wikipedia.org/wiki/Feriados_no_Brasil
        fixedStateHolydays: function (state, currentDate) {
            switch (state) {
                case 'AC':
                    return [
                        { name: 'Dia dos Evangélicos', date: new Date(currentDate.getFullYear(), ls_date.months.january, 23) },
                        { name: 'Dia das Mulheres', date: new Date(currentDate.getFullYear(), ls_date.months.march, 8) },
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.june, 15) },
                        { name: 'Dia da Amazônia', date: new Date(currentDate.getFullYear(), ls_date.months.september, 5) },
                        { name: 'Dia da Assinatura do Tratado de Petrópolis', date: new Date(currentDate.getFullYear(), ls_date.months.november, 17) }
                    ];
                case 'AL':
                    return [
                    { name: 'Dia de São João', date: new Date(currentDate.getFullYear(), ls_date.months.june, 24) },
                    { name: 'Dia de São Pedro', date: new Date(currentDate.getFullYear(), ls_date.months.june, 29) },
                    { name: 'Dia da Emancipação Política', date: new Date(currentDate.getFullYear(), ls_date.months.september, 16) },
                    { name: 'Dia da Morte de Zumbi dos Palmares', date: new Date(currentDate.getFullYear(), ls_date.months.november, 20) },
                    ];
                case 'AP':
                    return [
                        { name: 'Dia de São José', date: new Date(currentDate.getFullYear(), ls_date.months.march, 19) },
                        { name: 'Criação do Território Federal', date: new Date(currentDate.getFullYear(), ls_date.months.september, 13) },
                    ];
                case 'AM':
                    return [
                        { name: 'Dia da Elevação do Amazonas à Categoria de Província', date: new Date(currentDate.getFullYear(), ls_date.months.september, 5) },
                        { name: 'Dia da Consciência Negra', date: new Date(currentDate.getFullYear(), ls_date.months.november, 20) },
                    ];
                case 'BA':
                    return [
                        { name: 'Dia da Independência da Bahia', date: new Date(currentDate.getFullYear(), ls_date.months.july, 2) },
                    ];
                case 'CE':
                    return [
                        { name: 'Dia da Abolição da Escravatura', date: new Date(currentDate.getFullYear(), ls_date.months.march, 25) },
                    ];
                case 'DF':
                    return [
                        { name: 'Dia da Fundação de Brasília', date: new Date(currentDate.getFullYear(), ls_date.months.abril, 21) },
                        { name: 'Dia do Evangélico', date: new Date(currentDate.getFullYear(), ls_date.months.november, 30) },
                    ];
                case 'ES': return [];
                case 'GO': return [];
                case 'MA':
                    return [
                        { name: 'Dia da Adesão do Maranhão à Independencia do Brasil', date: new Date(currentDate.getFullYear(), ls_date.months.july, 28) },
                    ];
                case 'MT':
                    return [
                        { name: 'Dia da Consciência Negra', date: new Date(currentDate.getFullYear(), ls_date.months.november, 20) },
                    ];
                case 'MS':
                    return [
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.october, 11) },
                    ];
                case 'MG':
                    return [
                        { name: 'Dia de Magna do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.abril, 21) },
                    ];
                case 'PA':
                    return [
                        { name: 'Dia da Adesão do Grão-Para à Independência do Brasil', date: new Date(currentDate.getFullYear(), ls_date.months.august, 15) },
                    ];
                case 'PB':
                    return [
                        { name: 'Dia de Homenagem à Memória do Ex-Presidente João Pessoa', date: new Date(currentDate.getFullYear(), ls_date.months.july, 26) },
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.august, 5) },
                    ];
                case 'PR':
                    return [
                        { name: 'Dia da Emancipação Política', date: new Date(currentDate.getFullYear(), ls_date.months.december, 19) },
                    ];
                case 'PE': return [];
                case 'PI':
                    return [
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.october, 19) },
                    ];
                case 'RJ':
                    return [
                        { name: 'Dia de São Jorge', date: new Date(currentDate.getFullYear(), ls_date.months.abril, 23) },
                        { name: 'Dia da Consciência Negra', date: new Date(currentDate.getFullYear(), ls_date.months.november, 20) },
                    ];
                case 'RN':
                    return [
                        { name: 'Dia da Proclamação da República do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.october, 3) },
                    ];
                case 'RO':
                    return [
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.january, 4) },
                        { name: 'Dia do Evangélico', date: new Date(currentDate.getFullYear(), ls_date.months.june, 18) },
                    ];
                case 'RR':
                    return [
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.october, 5) },
                    ];
                case 'SC':
                    return [
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.august, 11) },
                        { name: 'Dia de Santa Catarina de Alexandria', date: new Date(currentDate.getFullYear(), ls_date.months.november, 25) },
                    ];
                case 'SP':
                    return [
                        { name: 'Dia da Revolução Constitucionalista de 1932', date: new Date(currentDate.getFullYear(), ls_date.months.july, 9) },
                    ];
                case 'SE':
                    return [
                        { name: 'Dia da Emancipação Política', date: new Date(currentDate.getFullYear(), ls_date.months.july, 8) },
                    ];
                case 'TO':
                    return [
                        { name: 'Dia do Aniversário do Estado', date: new Date(currentDate.getFullYear(), ls_date.months.october, 5) },
                        { name: 'Dia da Emancipação Política', date: new Date(currentDate.getFullYear(), ls_date.months.march, 18) },
                        { name: 'Dia de Nossa Sra. da Natividade', date: new Date(currentDate.getFullYear(), ls_date.months.september, 8) },
                    ];
                default: return [];

            }
        }
    };
    var ls_date = {
        useHolyFriday: false,
        months: {
            january: 0,
            february: 1,
            march: 2,
            april: 3,
            may: 4,
            june: 5,
            july: 6,
            august: 7,
            september: 8,
            october: 9,
            november: 10,
            december: 11
        },
        daysOfWeek: {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6
        },
        states: {
            AC: 'AC',
            AL: 'AL',
            AM: 'AM',
            AP: 'AP',
            BA: 'BA',
            CE: 'CE',
            DF: 'DF',
            ES: 'ES',
            GO: 'GO',
            MA: 'MA',
            MG: 'MG',
            MS: 'MS',
            MT: 'MT',
            PA: 'PA',
            PB: 'PB',
            PE: 'PE',
            PI: 'PI',
            PR: 'PR',
            RJ: 'RJ',
            RN: 'RN',
            RO: 'RO',
            RR: 'RR',
            RS: 'RS',
            SC: 'SC',
            SE: 'SE',
            SP: 'SP',
            TO: 'TO'
        },
        setElectionDays: function (firstRound, secondRound) {
            holydays.electionDays[0].date = firstRound instanceof Date ? firstRound : null;
            holydays.electionDays[1].date = secondRound instanceof Date ? secondRound : null;

            return holydays.electionDays;
        },
        addLocalHolyday: function (date, name) {
            if (!(date instanceof Date)) throw 'The date parameter must be a valid date';

            name = name || ((holydays.localHolydays.length + 1) + '');

            holydays.localHolydays.push({ name: name, date: date });
        },
        clearLocalHolyday: function () {
            holydays.localHolydays = [];
        },
        isWeekend: function (date) {
            date = new Date(date || new Date());

            if (!date || !(date instanceof Date)) throw 'The date parameter must be a valid date. (Ex: ' + new Date().toString() + ')';

            return date.getDay() === ls_date.daysOfWeek.saturday || date.getDay() === ls_date.daysOfWeek.sunday;
        },
        isHolyday: function (options) {
            options = options || {};

            var date = new Date(options.date || new Date()),
                state = (options.state || '').toUpperCase();

            if (!date || !(date instanceof Date)) throw 'The date parameter must be a valid date. (Ex: ' + new Date().toString() + ')';

            if (!state || state.length !== 2) {
                console.log('You did not pass the state parameter, so we will use all the Brazil states holydays to validate.')
            };


            var isHolyday = false;
            var allHolydays = initHolydays(date, state);
            for (var i = 0; i < allHolydays.length; i++) {
                if (isHolyday) continue;

                var validationDate = allHolydays[i].date;

                isHolyday = (
                    date.getDay() === validationDate.getDay() &&
                    date.getMonth() === validationDate.getMonth() &&
                    date.getFullYear() === validationDate.getFullYear()
                );
            }

            return isHolyday;
        },
        isWorkDay: function (options) {
            options = options || {};

            return !ls_date.isHolyday(options) && !ls_date.isWeekend(options.date);
        },
        getNextHolyday: function (options) {
            options = options || {};

            var date = new Date(options.date || new Date()),
                state = (options.state || '').toUpperCase();

            if (!date || !(date instanceof Date)) throw 'The date parameter must be a valid date. (Ex: ' + new Date().toString() + ')';

            var found;
            var allHolydays = initHolydays(date, state);
            for (var i = 0; i < allHolydays.length; i++) {
                if (!!found) continue;

                var nextHolyday = allHolydays[i].date;
                if ((date - nextHolyday) <= 0) {
                    found = nextHolyday;
                }
            }

            if (!found) {
                options.date.setDate(1);
                options.date.setMonth(ls_date.months.january);
                options.date.setYear(options.date.getFullYear() + 1);

                return ls_date.getNextHolyday(options);
            } else {
                return found;
            }
        },
        getAllHolydaysOfTheYear: function (options) {
            options = options || {};

            var date = new Date(options.date || new Date()),
                state = (options.state || '').toUpperCase();

            if (!date || !(date instanceof Date)) throw 'The date parameter must be a valid date. (Ex: ' + new Date().toString() + ')';

            return initHolydays(date, state);
        }
    };

    if (!!commonjs) {
        module.export = ls_date;
    } else {
        window.ls_date = ls_date;
    }
})(document, window, typeof (exports) !== "undefined");