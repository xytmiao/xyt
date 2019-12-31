// 生成图表
function echart(data) {
    var categories = new Array()
    var datas = new Array()


    for (var i in data) {
        datas.push(data[i].length)
        categories.push(i)
    }

    var myChart = echarts.init(document.getElementById('echart_1'));
    // 显示标题，图例和空的坐标轴
    myChart.setOption({
        title: {
            text: '获奖信息统计'
        },
        tooltip: {},
        legend: {
            data: ['获奖数']
        },
        xAxis: {
            data: categories
        },
        yAxis: {},
        series: [{
            name: '获奖数',
            type: 'bar',
            data: datas
        }]
    });

    myChart.on('click', function(params) {
        var prize = new Array()
        for (var i in data) {
            if (params.name == i) {
                for (var j = 0; j < data[i].length; j++) {
                    if (prize[data[i][j]]) {
                        prize[data[i][j]]++
                    } else {
                        prize[data[i][j]] = 1
                    }
                }
            }
        }
        $('#echart_2').show();
        var Chart = echarts.init(document.getElementById('echart_2'));
        option = {
            title: {
                text: params.name + '获奖等级比例',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: (function() {
                    var rs = [];
                    for (var res in prize) {
                        rs.push(res);
                    }
                    return rs;
                })()
            },
            series: [{
                name: '奖项',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: (function() {
                    var rs = [];
                    for (var res in prize) {
                        rs.push({
                            name: res,
                            value: prize[res]
                        });
                    }
                    return rs;
                })(),
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        Chart.setOption(option);
    });

    if (categories.length != 0) { $('#echart_1').show() } else { $('#echart_1').hide() }
}