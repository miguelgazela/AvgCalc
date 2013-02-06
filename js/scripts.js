$(document).ready(function(){
	avg = 0;
	sumCreditsCompleted = 0;
	sumCredits_x_Grades = 0;
	
	Modernizr.localstorage ? LS_available = true : LS_available = false;
	if(LS_available) {
		if(localStorage['hasDataSaved'] == "true") {
			loadData();
			$('.nav').append('<li id="deleteNav"><a href="#" onClick="return showDeleteAllDataAlert()" rel="tooltip" title="WOW"><i class="icon-trash icon-white"></i> Eliminar notas</a></li>');
		} else {
			localStorage['entries'] = 0;
		}
	}
	$("#grade").hover(
		function () {
			$(this).html(avg.toFixed(2));
		},
		function () {
			if(avg - Math.floor(avg) >= 0.5) {
				$(this).html(Math.ceil(avg));
			} else {
				$(this).html(Math.floor(avg));
			}
		}
	);
});

function addGrade() {
	var errorOcurred = false;
	var className = $('#inputClassName').val();
	if(className.length == 0) {
		$('#inputClassName + span').html('O nome da cadeira é obrigatório.');
		$('#inputClassName').parents('.control-group').addClass('error');
		errorOcurred = true;
	} else {
		$('#inputClassName + span').html('');
		$('#inputClassName').parents('.control-group').removeClass('error');
	}

	var classGrade = $('#inputGrade').val();
	if(classGrade.length == 0 || classGrade > 20) {
		$('#inputGrade').parents('.control-group').addClass('error');
		errorOcurred = true;
		classGrade > 20 ? $('#inputGrade + span').html('Classificação inválida.') : $('#inputGrade + span').html('A classificação da cadeira é obrigatória.');
	} else {
		$('#inputGrade + span').html('');
		$('#inputGrade').parents('.control-group').removeClass('error');
	}

	var classECTS = $('#inputECTS').val();
	if(classECTS.length == 0 || classECTS > 30) {
		$('#inputECTS').parents('.control-group').addClass('error');
		errorOcurred = true;
		classECTS > 30 ? $('#inputECTS + span').html('Créditos inválidos.') : $('#inputECTS + span').html('O número de ECTS da cadeira é obrigatório.');
	} else {
		$('#inputECTS + span').html('');
		$('#inputECTS').parents('.control-group').removeClass('error');
	}

	if(!errorOcurred) {
		var grade;
		if(classGrade < 10) {
			grade = $('<span class="label label-important">'+classGrade+'</span>');
		} else {
			grade = $('<span class="label label-success">'+classGrade+'</span>');
		}
		if($('table').length == 0) {
			$('.container:last').append('<table class="table table-hover table-condensed"></table>');
			$('table').append('<tr><th>Cadeira</th><th>Classificação</th><th>Créditos/ECTS</th><th></th></tr>')
			$('table').append('<tr><td>'+className+'</td><td></td><td>'+classECTS+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(2)').append(grade);
			$('.nav').append('<li id="deleteNav"><a href="#" onClick="return showDeleteAllDataAlert()" rel="tooltip" title="Apaga todas as notas guardadas"><i class="icon-trash icon-white"></i> Eliminar notas</a></li>');
		} else {
			$('table').append('<tr><td>'+className+'</td><td></td><td>'+classECTS+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(2)').append(grade);
		}
		$('#inputClassName').val('');
		$('#inputGrade').val('');
		$('#inputECTS').val('');
		if(LS_available) {
			saveData(className,classGrade,classECTS);
		}
		if(parseInt(classGrade) >= 10) {
			updateAVG(parseInt(classGrade), parseInt(classECTS));
		}
	}	
}

function updateAVG(classGrade, classECTS) {
	console.log(classGrade);
	console.log(classECTS);
	sumCreditsCompleted +=  classECTS;
	if(classGrade > 0)
		sumCredits_x_Grades += (classGrade * classECTS);
	else
		sumCredits_x_Grades -= (classGrade * classECTS);
	avg = sumCredits_x_Grades / sumCreditsCompleted;
	if(avg - Math.floor(avg) >= 0.5) {
		$('#grade').html(Math.ceil(avg));
	} else {
		$('#grade').html(Math.floor(avg));
	}
	//$('table').before('<code>'+JSON.stringify(data)+'</code>'); //will be used for export data
}

function saveData(className,classGrade,classECTS) {
	var entries = parseInt(localStorage['entries']);
	if(entries == 0) {
		localStorage['hasDataSaved'] = true;
	}
	var entry = {name: className,grade: classGrade,ects: classECTS};
	localStorage[entries] = JSON.stringify(entry);
	$('tr:last').attr('id',entries);
	entries += 1;
	localStorage['entries'] = entries;
}

function loadData() {
	var entries = localStorage['entries'];
	$('body > .container').append('<table class="table table-hover table-condensed"></table>');
	$('table').append('<tr><th>Cadeira</th><th>Classificação</th><th>Créditos/ECTS</th><th></th></tr>');
	for(var i = 0; i < entries; i++) {
		if(localStorage[i]) {
			var entry = JSON.parse(localStorage[i]);
			var classGrade = entry.grade;
			if(classGrade < 10) {
				gradeLabel = $('<span class="label label-important">'+classGrade+'</span>');
			} else {
				gradeLabel = $('<span class="label label-success">'+classGrade+'</span>');
				updateAVG(parseInt(classGrade),parseInt(entry.ects));
			}
			$('table').append('<tr><td>'+entry.name+'</td><td></td><td>'+entry.ects+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(2)').append(gradeLabel);
		}
	}
}

function showDeleteAllDataAlert() {
	$('.hero-unit').before('<div class="alert alert-block alert-error fade in"></div>');
	$('.alert-error').append('<button type="button" class="close" data-dismiss="alert">&times</button>');
	$('.alert-error').append('<h4 class="alert-heading">Aviso!</h4>');
	$('.alert-error').append('<p>Esta operação é irreversível.</p>');
	$('.alert-error').append('<p><a class="btn btn-danger" href="#" onClick="return deleteAllData()"><i class="icon-white icon-trash"></i> Apagar</a> <a class="btn" href="#" onClick="return removeDeleteAllDataAlert()">Cancelar</a></p>');
}

function removeDeleteAllDataAlert() {
	$('.alert-error').remove();
}

function deleteAllData() {
	localStorage.clear();
	location.reload();
}

function removeEntry(element) {
	var row = $(element).parents('tr');
	var classGrade = parseInt(row.find('span').html());
	var classCredits = parseInt(row.find('td:nth-child(3)').html());
	if(LS_available) {
		var id = row.attr('id');
		localStorage.removeItem(id);
	}
	updateAVG(-classGrade,-classCredits);
	$(element).parents('tr').remove();
}
