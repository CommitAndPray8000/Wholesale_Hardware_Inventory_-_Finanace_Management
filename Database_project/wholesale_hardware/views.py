from django.shortcuts import render

def index(request):
    """Renders the wholesale hardware central operations portal."""
    return render(request, 'index.html')
