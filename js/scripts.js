$(document).ready(function(){
	//data = new Object;
	//data['numEntries'] = 0;
	//data['entries'] = [];

	avg = 0;
	sumCreditsCompleted = 0;
	sumCredits_x_Grades = 0;
	//localStorage.clear();
	
	Modernizr.localstorage ? LS_available = true : LS_available = false;
	if(LS_available) {
		if(localStorage['hasDataSaved'] == "true") {
			loadData();
			$('.nav').append('<li id="deleteNav"><a href="#" onClick="return showDeleteAllDataAlert()" rel="tooltip" title="WOW"><i class="icon-trash icon-white"></i> Eliminar notas</a></li>');
		} else {
			localStorage['entries'] = 0;
		}
	}
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
			$('table').append('<tr><th>#</th><th>Cadeira</th><th>Classificação</th><th>Créditos/ECTS</th><th></th></tr>')
			$('table').append('<tr><td>'+$('tr').length+'</td><td>'+className+'</td><td></td><td>'+classECTS+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(3)').append(grade);
			$('.nav').append('<li id="deleteNav"><a href="#" onClick="return showDeleteAllDataAlert()" rel="tooltip" title="WOW"><i class="icon-trash icon-white"></i> Eliminar notas</a></li>');
		} else {
			$('table').append('<tr><td>'+$('tr').length+'</td><td>'+className+'</td><td></td><td>'+classECTS+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(3)').append(grade);
		}
		$('#inputClassName').val('');
		$('#inputGrade').val('');
		$('#inputECTS').val('');
		if(LS_available) {
			saveData(className,classGrade,classECTS);
		}
		updateAVG(parseInt(classGrade), parseInt(classECTS));
	}
}

function updateAVG(classGrade, classECTS) {
	if(classGrade >= 10) {
		sumCreditsCompleted +=  classECTS;
		sumCredits_x_Grades += (classGrade * classECTS);
		avg = sumCredits_x_Grades / sumCreditsCompleted;
		if(avg - Math.floor(avg) >= 0.5) {
			$('#grade').html(Math.ceil(avg));
		} else {
			$('#grade').html(Math.floor(avg));
		}
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
	entries += 1;
	localStorage['entries'] = entries;
}

function loadData() {
	var entries = localStorage['entries'];
	console.log(entries);
	$('body > .container').append('<table class="table table-hover table-condensed"></table>');
	$('table').append('<tr><th>#</th><th>Cadeira</th><th>Classificação</th><th>Créditos/ECTS</th><th></th></tr>');
	for(var i = 0; i < entries; i++) {
		var entry = JSON.parse(localStorage[i]);
		console.log(entry);
		var classGrade = entry.grade;
		if(classGrade < 10) {
			gradeLabel = $('<span class="label label-important">'+classGrade+'</span>');
		} else {
			gradeLabel = $('<span class="label label-success">'+classGrade+'</span>');
			updateAVG(parseInt(classGrade),parseInt(entry.ects));
		}
		$('table').append('<tr><td>'+$('tr').length+'</td><td>'+entry.name+'</td><td></td><td>'+entry.ects+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
		$('tr:last > td:nth-child(3)').append(gradeLabel);
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
	avg = 0;
	sumCreditsCompleted = 0;
	sumCredits_x_Grades = 0;
	$('#grade').html(avg);
	$('.alert-error').remove();
	$('table').remove();
	$('#deleteNav').remove();
	localStorage.clear();
}

function removeEntry(element) {
	var row = $(element).parents('tr');
	console.log(row.find('td').html()); // the index 
	$(element).parents('tr').remove();
}
